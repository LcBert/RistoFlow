# Project Development Standards & Guidelines

This document defines the architectural, engineering, and coding standards for the restaurant management system. All contributors and automated agents must adhere to these guidelines to ensure consistency, performance, type safety, and maintainability.

---

## 1. System Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   Angular 19 Frontend                  │
│  - Standalone Components      - Signals Reactive State │
│  - Reactive Forms Typed       - SCSS Modern Styling    │
└───────────────────────────▲────────────────────────────┘
                            │ HTTP (REST JSON)
┌───────────────────────────▼────────────────────────────┐
│                  Django REST Backend                   │
│  - Django Models (Postgres)   - ModelViewSets & Router │
│  - Atomic DB Transactions     - Serializers & Policies │
└────────────────────────────────────────────────────────┘
```

---

## 2. Backend Standards (Python & Django)

### 2.1 Tooling & Environment
- **Package Manager:** `uv` (`uv run python manage.py ...`).
- **Python Version:** 3.13+.
- **Language & Comments:** All code, docstrings, and in-code comments must be in **English**.

### 2.2 Models & Database (`core/models.py`)
1. **Primary Keys:**
   - Define primary keys explicitly when domain-specific (e.g., `Table.number` as `IntegerField(primary_key=True)`).
   - For surrogate keys, use `BigAutoField(primary_key=True)`.
2. **Naming Conventions:**
   - Model classes: `PascalCase` singular (`Table`, `Dish`, `Category`, `Order`, `OrderItem`).
   - Field names & database columns: `snake_case` (`is_available`, `total_price`, `opened_at`).
   - Related names: Explicit, plural, and self-documenting (e.g., `related_name="items"` on `OrderItem.order`, `related_name="dishes"` on `Dish.category`).
3. **Type Checking & Relations:**
   - Use `if TYPE_CHECKING:` blocks for reverse managers to ensure clean mypy/IDE autocompletion:
     ```python
     if TYPE_CHECKING:
         items: RelatedManager["OrderItem"]
     ```
4. **Status & Enumerations:**
   - Use `models.TextChoices` for all state machine fields:
     ```python
     class TableStatus(models.TextChoices):
         FREE = "FREE", "Free"
         OCCUPIED = "OCCUPIED", "Occupied"
         RESERVED = "RESERVED", "Reserved"
     ```
5. **Computed Values & Integrity:**
   - Business calculations based on related items should be expressed as properties or domain methods:
     ```python
     @property
     def total_price(self) -> Decimal:
         return sum((item.subtotal for item in self.items.all()), Decimal("0.00"))
     ```

### 2.3 Serializers (`core/serializers.py`)
1. **Explicit Fields:**
   - **Never** use `fields = '__all__'`. Explicitly specify required fields in a list.
2. **Read-only vs Writeable Fields:**
   - Explicitly declare computed, primary key, or relation display fields as `read_only=True`:
     ```python
     status_display = serializers.CharField(source='get_status_display', read_only=True)
     total_price = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
     ```
3. **Context Sensitivity:**
   - When serializing media files (logos, images), ensure `context={'request': request}` is passed so URLs are returned absolute (`http://.../media/...`).

### 2.4 Views & ViewSets (`core/views.py`)
1. **Resource Modeling:**
   - Use `ModelViewSet` registered with `DefaultRouter` in `urls.py`.
   - Endpoints must follow standard plural REST conventions: `/api/tables/`, `/api/dishes/`, `/api/orders/`.
2. **Business Logic & Multi-Entity Updates (Atomic Transactions):**
   - **Golden Rule:** The backend is the single source of truth for database state. Never coordinate multi-step entity transitions across multiple HTTP calls from the client.
   - Use `transaction.atomic()` inside hooks (`perform_create`, `perform_update`) to guarantee all-or-nothing execution:
     ```python
     from django.db import transaction

     class OrderViewSet(viewsets.ModelViewSet):
         queryset = Order.objects.all().prefetch_related('items__dish')
         serializer_class = OrderSerializer

         def perform_create(self, serializer):
             with transaction.atomic():
                 order = serializer.save()
                 order.table.status = TableStatus.OCCUPIED
                 order.table.save()
     ```
3. **Query Optimization:**
   - Always prevent N+1 queries using `select_related()` for single foreign keys and `prefetch_related()` for reverse relations / many-to-many.

---

## 3. Frontend Standards (Angular 19+)

### 3.1 Component Architecture
1. **Standalone Only:**
   - All components must be standalone (`standalone: true` default in v19). Do not use `NgModule`.
   - Specify only necessary imports in the `@Component({ imports: [...] })` array.
2. **Control Flow:**
   - Use modern Angular control flow syntax (`@if`, `@for`, `@switch`). Avoid legacy `*ngIf` and `*ngFor`.
   - Always supply an explicit track expression in `@for`:
     ```html
     @for (table of allTables(); track table.number) {
       <app-table-card [table]="table" />
     }
     ```
3. **Inputs and Outputs:**
   - Use modern signal-based inputs and outputs:
     ```typescript
     readonly table = input.required<Table>();
     readonly close = output<void>();
     ```

### 3.2 Reactive State Management (Signals)
1. **Service-Centric State:**
   - Use Angular Signals for central state management within services.
   - Expose state as readonly signals to prevent uncontrolled mutations from components:
     ```typescript
     @Injectable({ providedIn: 'root' })
     export class TablesService {
       private readonly _tables = signal<Table[]>([]);
       readonly tables = this._tables.asReadonly();
       
       private readonly _loading = signal<boolean>(false);
       readonly loading = this._loading.asReadonly();
     }
     ```
2. **Local Component Derivations:**
   - Use `computed()` for filtered or derived state:
     ```typescript
     protected readonly freeTables = computed(() =>
       this.tablesService.tables().filter((t) => t.status === 'FREE')
     );
     ```

### 3.3 HTTP & Services
1. **Single Responsibility:**
   - Components must never inject `HttpClient` directly. All network requests belong in `@Injectable` service classes.
2. **API URLs:**
   - Dynamically reference the host using `window.location.hostname` to support local, docker, and network devices seamlessly:
     ```typescript
     private readonly apiUrl = `http://${window.location.hostname}:8000/api/orders/`;
     ```
3. **No Redundant HTTP Calls:**
   - If the backend updates related records during a transaction, the frontend must not issue redundant `PATCH` requests. Either trigger a refresh (`this.tablesService.loadTables()`) or update the signal locally.
4. **Asynchronous Navigation Safety:**
   - Return an `Observable` from mutating service methods and subscribe in the component before navigating:
     ```typescript
     // service
     openNewOrder(tableNumber: number, covers: number): Observable<Order> {
       return this.http.post<Order>(this.apiUrl, payload).pipe(
         tap((newOrder) => {
           this._orders.update((curr) => [...curr, newOrder]);
           this.tablesService.loadTables();
         })
       );
     }

     // component
     this.ordersService.openNewOrder(tableNumber, covers).subscribe({
       next: () => this.router.navigate(['/tables', tableNumber])
     });
     ```

### 3.4 Forms
1. **Typed Reactive Forms:**
   - Use `FormBuilder.nonNullable` to avoid nullable types on standard required inputs.
   - Always bind input elements with `formControlName`:
     ```html
     <input type="number" id="table-number" formControlName="number" min="1" />
     ```
2. **Custom Controls (Steppers & Number Inputs):**
   - Number inputs used in flex containers must include `min-width: 0; box-sizing: border-box;` to prevent layout overflow.
   - Hide native browser spinners on number inputs for custom stepper designs.

---

## 4. UI / UX & Styling Standards (SCSS)

### 4.1 Layout & Host Rules
1. **Custom Component Display:**
   - Web components default to `display: inline`. Router-rendered or page-level components must declare `:host`:
     ```scss
     :host {
       display: flex;
       flex-direction: column;
       flex: 1;
       width: 100%;
       min-height: 0;
     }
     ```
2. **Router Outlet Isolation:**
   - Prevent `<router-outlet>` from taking flex space in `.content`:
     ```scss
     .content {
       flex: 1;
       display: flex;
       flex-direction: column;
       width: 100%;

       router-outlet {
         display: none;
       }

       > *:not(router-outlet) {
         flex: 1;
         display: flex;
         flex-direction: column;
         width: 100%;
       }
     }
     ```

### 4.2 Modal Dialog Pattern
- When adding or editing items in-place (e.g., adding tables, adding dishes), use an in-page modal dialog overlay rather than navigating away from the working screen.
- Standard modal template:
  ```html
  <div class="modal-backdrop" (click)="onCancel()">
    <div class="card-form" (click)="$event.stopPropagation()">
      <!-- Form content -->
    </div>
  </div>
  ```
- Backdrops must have `position: fixed; inset: 0; z-index: 1000; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px);`.

### 4.3 Color Palette & Design Tokens
| Role | Color Hex | Usage |
| :--- | :--- | :--- |
| **Background Dark** | `#0f172a`, `#1e293b` | Main container cards and surfaces |
| **Layout Gradient** | `linear-gradient(145deg, #222222, #323232)` | Application page background |
| **Accent Emerald** | `#10b981` (hover `#059669`) | Primary actions, free status, confirmations |
| **Warning / Occupied** | `#ef4444`, `#f87171` | Occupied tables, alerts, deletions |
| **Subtle Borders** | `rgba(255, 255, 255, 0.08)` to `0.12` | Card borders, dividers, inputs |

---

## 5. API & Data Contract Alignment

| Concept | Django Model Field | DRF Serializer | Angular Model (`restaurant.models.ts`) | Service Payload |
| :--- | :--- | :--- | :--- | :--- |
| **Table Number** | `number` (Int, PK) | `number` | `number: number` | `table: number` |
| **Dish ID** | `id` (BigAutoField, PK) | `id` | `id: number` | `id: number` |
| **Dish Availability** | `is_available` (Bool) | `is_available` | `is_available: boolean` | `{ is_available: boolean }` |
| **Order Status** | `status` (TextChoice) | `status` | `status: "OPEN" \| "BILLED" \| ...` | `{ status: "OPEN" }` |
| **Order Covers** | `covers` (PositiveInt) | `covers` | `covers: number` | `{ covers: number }` |

---

## 6. Git & Contribution Rules

1. **Non-destructive Operations:** Never execute destructive or mutating Git operations (`git reset --hard`, unauthorized branch deletion, force pushing).
2. **Atomic Commits:** Commit cohesive feature slices (e.g. backend model + migration + serializer together; frontend component + service together).
3. **Commit Messages:** Use conventional commit messages in English (`feat: ...`, `fix: ...`, `refactor: ...`, `style: ...`).
