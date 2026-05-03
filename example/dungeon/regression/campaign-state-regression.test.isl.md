# Project: Dungeon React Regression Tests

**Version**: 1.0.0
**ISL Version**: 1.6.2
**Created**: 2026-04-27
**Implementation**: ./regression/campaign-state-regression.test

---

> **Reference**: `../play-game.isl.md` > **Reference**: `../dungeon.isl.md` > **Reference**: `../dungeon-use-campaign-manager.isl.md`

## Component: CampaignStateRegression

### Role: Test

### ⚡ Scenarios

## Scenario: Progression Mission Preserves Hero Vitals

- **Target**: `PlayGame.selectMission`
- **Given**:
  - Saved campaign data exists with `nextMissionIndex = 2`.
  - Saved hero state for hero 1 has `currentBody = 3` and `currentMind = 2` (below maxima).
- **When**:
  - User starts mission `index = 2` (current progression mission).
- **Assert (Expected Outcomes)**:
  - Mission bootstrap uses saved hero snapshots without forcing full heal.
  - Hero 1 remains `currentBody = 3` and `currentMind = 2`.
  - Session progression remains continuous across missions.

## Scenario: Replay of Completed Mission Resets Hero Vitals to Max

- **Target**: `PlayGame.selectMission`
- **Given**:
  - Saved campaign data exists with `nextMissionIndex = 3`.
  - Saved hero state for hero 1 has `currentBody = 1` and `currentMind = 1`.
  - Hero 1 base maxima are `hero.corpo = 8` and `hero.mente = 3`.
- **When**:
  - User starts mission `index = 1` (already completed mission, replay).
- **Assert (Expected Outcomes)**:
  - Mission bootstrap marks this as replay (`index < nextMissionIndex`).
  - Hero 1 starts mission with `currentBody = 8` and `currentMind = 3`.
  - Other hero fields (gold, inventory, equipment, statuses) remain aligned with saved campaign snapshot unless another explicit rule changes them.

## Scenario: Mission Completion Must Not Auto-Heal Campaign Save

- **Target**: `Dungeon.completeMission`
- **Given**:
  - Active mission session has hero 1 with `currentBody = 2`, `currentMind = 1` before end-mission scripts.
  - End-mission scripts (`eventType = 7`) execute and may mutate unrelated state.
- **When**:
  - `completeMission` persists campaign data through `saveCampaign`.
- **Assert (Expected Outcomes)**:
  - Persisted hero vitals are taken from pre-end snapshot for each matching `heroId`.
  - Campaign save does NOT restore body/mind to base maxima.
  - Unlock progression still advances to `max(savedIndex, currentMissionIndex + 1)`.

## Scenario: Retreat Save Must Not Auto-Heal Campaign Save

- **Target**: `Dungeon.leaveDungeonAfterRetreat`
- **Given**:
  - Active mission session has hero 2 with reduced vitals before retreat end flow.
  - End-mission scripts (`eventType = 7`) execute in retreat context.
- **When**:
  - Retreat flow persists campaign data.
- **Assert (Expected Outcomes)**:
  - Persisted vitals for each known hero are preserved from the pre-end snapshot.
  - Retreat does not unlock new missions beyond already saved progression.
  - Returning to `PLAY_GAME` keeps campaign continuity without hidden full-heal.

### ✅ Coverage Intent

- Covers regression boundary between campaign progression and completed-mission replay.
- Covers both mission-end save paths: victory and retreat.
- Guards against accidental reintroduction of full-heal behavior in save/selection flows.
