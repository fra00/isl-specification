# Project: Heroquest React

**Version**: 1.0.0
**ISL Version**: 1.6.1
**Created**: 2026-02-09
**Implementation**: ./domain-map

---

> **Reference**: @Monster, @Item, @Equipment in `./domain-ruleset.isl.md`

## Component: GameDomainMap

### Role: Domain

## Domain Concepts

### 📦 Content/Structure

#### `MapDefinition`

Represents the full definition of a game map/mission loaded from JSON.

- `header`: Map metadata (@MapHeader).
- `grid`: The grid of cells composing the map (List of @MapCell).
- `eroi_start`: Starting positions for heroes (List of @MapHeroStart).
- `porte`: List of doors on the map (List of @MapDoor).
- `scripts`: List of event scripts (List of @MapScript).

#### `MapHeader`

Metadata for the map.

- `descrizione`: Description text of the mission (String).
- `mostro_uscita`: ID of the monster (@Monster) that must be defeated to complete the mission (Integer, sentinel `-1` means no monster objective).
- `tesoro_finale`: Coordinate of the treasure cell that must be found to complete the mission (@MapObjectiveCoordinate). Sentinel `{ x: 0, y: 0 }` means no final-treasure objective.
- `oggetto_f`: ID of the quest item (@Item) that must be recovered to complete the mission (Integer, sentinel `-1` means no item objective).
- `arma_f`: ID of the quest weapon (@Equipment) that must be recovered to complete the mission (Integer, sentinel `-1` means no weapon objective).
- `merr`: ID of the wandering monster (@Monster) used by the quest when a wandering-monster card is drawn (Integer). Default `1` preserves the historical Orc fallback; sentinel `-1` means the quest uses a special wandering event with no standard monster spawn.
- `nfine`: End condition identifier (Integer).

#### `MapObjectiveCoordinate`

Coordinate of a mission objective cell.

- `x`: X coordinate (Integer).
- `y`: Y coordinate (Integer).

#### `MapCell`

Represents a single cell in the map grid.

- `x`: X coordinate (Integer).
- `y`: Y coordinate (Integer).
- `arnt`: Area not transitable properties (@BlockCellArea).
- `mobili`: Furniture properties (@MapCellFurniture).
- `mostab`: Monster properties (@MapCellMonster).
- `tes`: Treasure properties (@MapCellTreasure).
- `psgg`: Secret passage properties (@MapCellPassage).
- `trpl`: Trap properties (@MapCellTrap).
- `fine`: End point indicator (String).

#### `BlockCellArea`

- `antroc`: Rock block transition (Boolean).
- `inv`: Invisible block transition (Boolean).

#### `MapCellFurniture`

- `num`: Furniture ID (Integer nullable).
- `img`: Image filename (String).

#### `MapCellMonster`

- `mosid`: Monster ID (@Monster) (Integer).
- `mos`: Monster present flag (Boolean).
- `corpo`: Specific body points for this monster instance (Integer).

#### `MapCellTreasure`

- `mon`: Gold amount (Integer).
- `ogg`: Specific item ID (@Item) (Integer).
- `arma`: Specific weapon ID (@Equipment) (Integer).
- `trp`: Trap ID if search fails (Integer).

#### `MapCellPassage`

- `ps`: Passage ID/Type (Integer?) Default:null
- `oriz`: Orientation (Boolean).

#### `MapCellTrap`

- `tipo`: Trap type (Integer).
- `rccadex`: X coordinate of falling rock trap (Integer).
- `rccadey`: Y coordinate of falling rock trap (Integer).

#### `MapHeroStart`

Starting position for a hero.

- `id`: Hero ID (Integer).
- `x`: X coordinate (Integer).
- `y`: Y coordinate (Integer).

#### `MapDoor`

Definition of a door.

- `x`: X coordinate (Integer).
- `y`: Y coordinate (Integer).
- `oriz`: Indicates if the door is horizontal (Boolean).

#### `MapScript`

Event script location and data.

- `x`: X coordinate (Integer).
- `y`: Y coordinate (Integer).
- `text`: Text of the script (String).
- `evento`: Event ID (Integer).
- `unavolta`: Indicates if the script can run only once (Boolean).
- `morto`: Indicates if an attack script must trigger on monster death (Boolean).
- `idmosc`: Monster ID bound to attack events (Integer).

#### `Campaign`

Represents a campaign definition containing a sequence of missions.

- `nome_campagna`: Name of the campaign (String).
- `missioni`: List of missions in the campaign (List of @Mission).

#### `Mission`

Represents a single mission within a campaign.

- `ordine`: Order of the mission in the campaign (Integer).
- `file`: Filename of the mission map (String).
- `titolo`: Title of the mission (String).

#### `VisibilityMap`

Represents the visibility/fog-of-war configuration for the game board.

- `source`: Source filename (String).
- `image`: Background image filename (String).
- `data`: List of visibility data for each cell (List of @VisibilityCell).

#### `VisibilityCell`

Represents visibility properties for a specific grid coordinate.

- `x`: X coordinate (Integer).
- `y`: Y coordinate (Integer).
- `valo`: Room/Area ID this cell belongs to (String).
- `vis1`: ID of the first area visible from this cell (String).
- `vis2`: ID of the second area visible from this cell (String).
- `fog`: cell is under fog of war (boolean) default true

#### `GameScript`

Represents an interactive script action.

- `command`: The instruction command (e.g., aggoro, merr) (String).
- `params`: Associated numeric value (Integer).
- `isOneTime`: Indicates if the script is removed after execution (Boolean).
