# Project: MockupForge

**Version**: 1.0.0
**ISL Version**: 1.6.1

---

## Domain Concepts

### Element

**Identity**: UUID
**Properties**:

- type: enum (button, input, label, image, container)
- x: number (absolute position in px)
- y: number (absolute position in px)
- w: number (dimensions in px)
- h: number (dimensions in px)
- properties: Map<string, any>
  - Vedi **ElementProperties** per il tipo specifico di proprietà per ogni tipo di elemento.
- zIndex: number (default 50 + Count element) - layering

### ElementProperties

Definizione degli schemi di proprietà specifici per ogni tipo di elemento.

**Schemas**:

- **Button**:
  - text: string
  - bgColor: color
  - textColor: color
  - borderRadius: number
- **Input**:
  - placeholder: string
  - type: enum (text, password, email)
  - fontSize: number
- **Label**:
  - text: string
  - fontSize: number
  - fontWeight: enum (normal, bold)
  - color: color
- **Image**:
  - src: string (url)
  - alt: string
- **Container**:
  - bgColor: color
  - borderRadius: number

### Canvas

**Properties**:

- width: number (default 1920)
- height: number (default 1080)
- backgroundColor: hex color
- grid: {show: boolean, size: number}

---

## Component: ComponentPalette

Palette laterale con lista di componenti (**Element\*\***.type) draggable per il canvas.

### 🔍 Appearance

- position: fixed left side
- width: 200px
- background: #f9f9f9
- padding: 16px
- border-radius: 8px
- box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- overflow-y: auto

### Role: Presentation

### 📦 Content

Lista componenti (**palette item**) draggable:

- Button
- Input
- Label
- Image
- Container

### ⚡ Capabilities

#### startDrag

**Contract**: Inizia drag di nuovo componente.
**Trigger**: dragstart su **palette item**.
**Side Effects**:

- dataTransfer contiene component type.

---

## Component: Canvas

Area di lavoro (Artboard).
**Implementation Note**: Implementato come container HTML (`div`) con `position: relative`.
Gli elementi figli sono nodi DOM reali posizionati in assoluto, NON disegnati su un tag `<canvas>`.

### Role: Presentation

### ⚡ Capabilities

#### dropComponent

**Contract**: Aggiunge nuovo elemento su canvas.
**Trigger**: drop event.
**Flow**:

1. Cattura coordinate drop (x, y)
2. Crea nuovo **Element** con default properties
3. Aggiunge a elementi[]
4. Renderizza

**🚨 Constraint**:

- MUST snap to grid if grid enabled (x = Math.round(x / gridSize) \* gridSize).
- MUST assign next available zIndex.

---

## Component: Element

Wrapper per l'elemento HTML reale (es. `button`, `input`) che gestisce la selezione e il posizionamento.

### Role: Presentation

### ⚡ Capabilities

#### select

**Contract**: Seleziona elemento per editing e mostra controlli.
**Trigger**: mousedown su elemento.
**Side Effects**:

- Mostra bounding box e **ancore**(posizionata nell'angolo in basso a destra).
- Popola **PropertyPanel** con le proprietà dell'elemento.
- Se Ctrl pressed: aggiungi a selezione multipla.

#### move

**Contract**: Sposta elemento su canvas.
**Trigger**: mouse down e start drag su elemento.
**Flow**:

1. mousedown: salva offset (element.x - mouseX)
2. mousemove: element.x = mouseX + offset
3. mouseup: fine move

**Cleanup**:
- Rimuovi event listeners mousemove/mouseup
- Aggiorna posizione element.x/y

**🚨 Constraint**:

- MUST constrain dentro canvas boundaries.
- MUST snap to grid se enabled.

**✅ Acceptance Criteria**:

1. Se selezionato element MUST have **ancore** visibili.

#### resize

**Contract**: Ridimensiona tramite **ancore**.
**Trigger**: MouseDown e start drag su **ancore**.
**Flow**:

1. Aggiorna w/h in base a direzione
2. Se aspect ratio locked: mantieni proporzioni

**Cleanup**:
- Rimuovi event listeners mousemove/mouseup

**🚨 Constraint**:

- MUST enforce minimum size 20x20px.
- MUST maintain aspect ratio if locked.

**✅ Acceptance Criteria**:

1. Element MUST resize correttamente tramite ancore.
2. Element MUST respect minimum size constraint.
3. Element MUST maintain aspect ratio if locked.

---

## Component: ToolBar Canvas

Barra strumenti orizzontale dentro al canvas con azioni comuni.

### Role: Presentation

### 🔍 Appearance

- position: top
- height: 40px
- background: #f9f9f9
- border-bottom: 1px solid #ddd
- padding: 8px 16px
- box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

### 📦 Content

- Button: "Bring to front"
- Button: "Send to back"

### ⚡ Capabilities

#### ToFront

**Contract**: Modifica layering.
**Trigger**: click "Bring to front" .
**Flow**:

1. "to front": element.zIndex = max(all zIndex) + 1
2. Se "to back": element.zIndex = min(all zIndex) - 1
3. Re-sort elementi[] per zIndex

#### ToBack

**Contract**: Modifica layering.
**Trigger**: click "Send to back" .
**Flow**:

1. Calcola nuovo zIndex = min(all zIndex) - 1
2. Se nuovo zIndex <= Canvas zIndex: nuovo zIndex = Canvas zIndex + 1
3. element.zIndex = nuovo zIndex
4. Re-sort elementi[] per zIndex

**🚨 Constraint**:

- element.zIndex MUST be > Canvas zIndex.

---

## Component: PropertyPanel

Panel laterale con form inputs per modificare proprietà dell'elemento selezionato.

### Role: Presentation

### 🔍 Appearance

- position: fixed right side
- width: 300px
- background: #f9f9f9
- padding: 16px
- border-radius: 8px
- box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- overflow-y: auto

### ⚡ Capabilities

#### updateProperty

**Contract**: Modifica proprietà elemento selezionato.
**Trigger**: change su input panel.
**Flow**:

1. Valida valore (es. color must be hex)
2. Aggiorna element.properties[key] = value
3. Re-render elemento

**🚨 Constraint**:

- L'aggiornamento della proprietà MUST riflettersi immediatamente sul canvas.
- L'aggiornamnento della proprietà MUST NOT influenzare altri elementi.

---

## Component: ExportService

### Role: Backend

### ⚡ Capabilities

#### exportHTML

**Contract**: Genera HTML + CSS del mockup.
**Flow**:

1. Itera su elementi[] ordinati per zIndex
2. Per ogni elemento:
   - Genera <div> con style inline
   - Per button: <button style="...">
   - Per input: <input style="...">
3. Wrappa in container con canvas dimensions
4. Trigger download

**💡 Implementation Hint**:

```javascript
function elementToHTML(element) {
  const style = `
    position: absolute;
    left: ${element.x}px;
    top: ${element.y}px;
    width: ${element.w}px;
    height: ${element.h}px;
    background-color: ${element.properties.bgColor};
    z-index: ${element.zIndex};
  `;

  if (element.type === "button") {
    return `${element.properties.text}`;
  }
  // ...
}
```

🧪 Test Scenarios:

1. **Drop Component**:
   - Input: Drop button at (100, 200)
   - Expected: Button created at (100, 200), default properties

2. **Snap to Grid**:
   - Precondition: Grid enabled, size 10px
   - Input: Drop at (107, 203)
   - Expected: Button snapped to (110, 200)

3. **Resize with Aspect Ratio**:
   - Precondition: Image 200x100, aspect locked
   - Input: Resize width to 400
   - Expected: Height auto-adjusts to 200

4. **Export HTML**:
   - Precondition: Canvas with 3 elements
   - Input: Click "Export HTML"
   - Expected: Valid HTML with 3 positioned elements
