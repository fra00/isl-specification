import { describe, expect, it } from "vitest";
import {
  BlockCellArea,
  Campaign,
  GameScript,
  MapCell,
  MapCellFurniture,
  MapCellMonster,
  MapCellPassage,
  MapCellTrap,
  MapCellTreasure,
  MapDefinition,
  MapDoor,
  MapHeader,
  MapHeroStart,
  MapObjectiveCoordinate,
  MapScript,
  Mission,
  VisibilityCell,
  VisibilityMap,
} from "../bin/domain-map";

describe("domain-map", () => {
  it("builds map header defaults and overrides", () => {
    expect(MapObjectiveCoordinate()).toEqual({ x: 0, y: 0 });
    expect(MapHeader()).toEqual({
      descrizione: "",
      mostro_uscita: -1,
      tesoro_finale: { x: 0, y: 0 },
      oggetto_f: -1,
      arma_f: -1,
      nfine: 0,
    });
    expect(
      MapHeader({
        descrizione: "x",
        mostro_uscita: 7,
        tesoro_finale: { x: 4, y: 5 },
        oggetto_f: 9,
        arma_f: 12,
        nfine: 2,
      }),
    ).toEqual({
      descrizione: "x",
      mostro_uscita: 7,
      tesoro_finale: { x: 4, y: 5 },
      oggetto_f: 9,
      arma_f: 12,
      nfine: 2,
    });
  });

  it("normalizes primitive map substructures", () => {
    expect(BlockCellArea({ antroc: 1, inv: 0 })).toEqual({
      antroc: true,
      inv: false,
    });
    expect(MapCellFurniture({ num: 2, img: "chair.png" })).toEqual({
      num: 2,
      img: "chair.png",
    });
    expect(MapCellMonster({ mosid: 9, mos: 1, corpo: 3 })).toEqual({
      mosid: 9,
      mos: true,
      corpo: 3,
    });
    expect(MapCellTreasure({ mon: 50, ogg: 1, arma: 2, trp: 3 })).toEqual({
      mon: 50,
      ogg: 1,
      arma: 2,
      trp: 3,
    });
    expect(MapCellPassage({ ps: 4, oriz: 1 })).toEqual({ ps: 4, oriz: true });
    expect(MapCellTrap({ tipo: 3, rccadex: 8, rccadey: 9 })).toEqual({
      tipo: 3,
      rccadex: 8,
      rccadey: 9,
    });
  });

  it("builds map cells and nested definitions recursively", () => {
    const map = MapDefinition({
      header: {
        descrizione: "desc",
        tesoro_finale: { x: 7, y: 8 },
        oggetto_f: 4,
        arma_f: 6,
        nfine: 1,
      },
      grid: [
        {
          x: 1,
          y: 2,
          arnt: { antroc: true },
          mobili: { num: 1, img: "box.png" },
          mostab: { mosid: 2, mos: true, corpo: 3 },
          tes: { mon: 10 },
          psgg: { ps: 5, oriz: true },
          trpl: { tipo: 2 },
          fine: "EXIT",
        },
      ],
      eroi_start: [{ id: 1, x: 4, y: 5 }],
      porte: [{ x: 6, y: 7, oriz: true }],
      scripts: [{ x: 8, y: 9, text: "hello", evento: 3 }],
    });

    expect(map.header).toEqual({
      descrizione: "desc",
      mostro_uscita: -1,
      tesoro_finale: { x: 7, y: 8 },
      oggetto_f: 4,
      arma_f: 6,
      nfine: 1,
    });
    expect(map.grid[0]).toEqual({
      x: 1,
      y: 2,
      arnt: { antroc: true, inv: false },
      mobili: { num: 1, img: "box.png" },
      mostab: { mosid: 2, mos: true, corpo: 3 },
      tes: { mon: 10, ogg: 0, arma: 0, trp: 0 },
      psgg: { ps: 5, oriz: true },
      trpl: { tipo: 2, rccadex: 0, rccadey: 0 },
      fine: "EXIT",
    });
    expect(map.eroi_start[0]).toEqual({ id: 1, x: 4, y: 5 });
    expect(map.porte[0]).toEqual({ x: 6, y: 7, oriz: true });
    expect(map.scripts[0]).toEqual({ x: 8, y: 9, text: "hello", evento: 3 });
  });

  it("builds campaign, mission, visibility and game script records", () => {
    expect(Mission({ ordine: 3, file: "m.json", titolo: "Quest" })).toEqual({
      ordine: 3,
      file: "m.json",
      titolo: "Quest",
    });
    expect(
      Campaign({
        nome_campagna: "Base",
        missioni: [{ ordine: 1, titolo: "One" }],
      }),
    ).toEqual({
      nome_campagna: "Base",
      missioni: [{ ordine: 1, file: "", titolo: "One" }],
    });
    expect(
      VisibilityCell({ x: 1, y: 2, valo: "A", vis1: "B", vis2: "C", fog: 0 }),
    ).toEqual({ x: 1, y: 2, valo: "A", vis1: "B", vis2: "C", fog: false });
    expect(
      VisibilityMap({
        source: "tbl",
        image: "map.png",
        data: [{ x: 1, y: 2 }],
      }),
    ).toEqual({
      source: "tbl",
      image: "map.png",
      data: [{ x: 1, y: 2, valo: "", vis1: "", vis2: "", fog: true }],
    });
    expect(GameScript({ command: "spawn", params: 7, isOneTime: 1 })).toEqual({
      command: "spawn",
      params: 7,
      isOneTime: true,
    });
  });

  it("keeps hero start, door and map script defaults stable", () => {
    expect(MapHeroStart()).toEqual({ id: 0, x: 0, y: 0 });
    expect(MapDoor()).toEqual({ x: 0, y: 0, oriz: false });
    expect(MapScript()).toEqual({ x: 0, y: 0, text: "", evento: 0 });
    expect(MapCell()).toEqual({
      x: 0,
      y: 0,
      arnt: { antroc: false, inv: false },
      mobili: { num: null, img: "" },
      mostab: { mosid: 0, mos: false, corpo: 0 },
      tes: { mon: 0, ogg: 0, arma: 0, trp: 0 },
      psgg: { ps: null, oriz: false },
      trpl: { tipo: 0, rccadex: 0, rccadey: 0 },
      fine: "",
    });
  });
});
