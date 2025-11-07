# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sistema de Gestão Acadêmica e Pedagógica** - Uma plataforma web profissional (SaaS) para coordenadores e instrutores gerenciarem turmas, alunos e métricas de desempenho. Este é um protótipo para validação de interface, não requer autenticação real, mas todos os formulários devem ser funcionais usando react-hook-form e Zod para validação.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

**Note:** This project uses `pnpm` as the package manager.

## Architecture Overview

### Framework & Tech Stack
- **Next.js 15.2.4 App Router** with TypeScript 5.7
- **React 19** with latest features
- **Tailwind CSS 3.4** for styling with professional minimalist design
- **react-hook-form 7.54 + Zod 3.24** for form validation
- **Radix UI + shadcn/ui** for accessible components (React 19 compatible)
- **Mock data** with localStorage persistence (simulates backend)

### Design System

#### Color Palette
- **Primary (Blue)**: `#2C5282` - Corporate blue for buttons, links, active icons
- **Accent (Orange)**: `#DD6B20` - Energy orange for highlights, secondary CTAs, chart emphasis
- **Background**: `#FAFAFA` (white) and `#F8F9FA` (light gray)
- **Text**: `#2D3748` (dark gray) for readability
- **Border**: `#E2E8F0` (very light gray)

#### Design Principles
- Minimalist and professional
- Generous white space usage
- Sans-serif typography (Geist Sans)
- Excellent readability focus
- No heavy shadows or complex gradients
- Clean, functional UI that inspires confidence
- Data-first approach

### User Roles & Permissions

#### 1. Admin
- All Coordenador capabilities
- Manage Coordenadores (create, delete, block)

#### 2. Coordenador
- Manage Turmas (create, edit, finalize, cancel classes)
- Manage Instrutores (register new)
- View Interessados list
- Access metrics dashboard (quantitative and qualitative)
- Generate monthly PDF reports
- Manage Alunos (create, edit, remove, withdraw from turmas)

#### 3. Instrutor
- View only assigned turmas
- Fill and edit class diary (summary, attendance, justify absences)
- View complete student history
- Add specific student notes

### Routing Structure

Routes are **role-based** with automatic redirection:

```
app/
├── page.tsx                    # Login page
├── admin/
│   ├── page.tsx                # Admin dashboard
│   ├── coordenadores/          # Coordenador management
│   ├── turmas/                 # All coordenador routes
│   ├── alunos/
│   ├── instrutores/
│   └── interessados/
├── coordenador/
│   ├── page.tsx                # Coordenador dashboard
│   ├── turmas/                 # Turma management
│   ├── alunos/                 # Student management
│   ├── instrutores/            # Instructor management
│   ├── interessados/           # Leads management
│   └── relatorios/             # Reports generation
└── instrutor/
    ├── page.tsx                # Instrutor dashboard
    ├── turmas/[id]/            # Assigned turmas
    └── alunos/[id]/            # Student history & notes
```

### Authentication System

**Mock authentication** using React Context API:
- Located in `lib/auth-context.tsx`
- Stores user in localStorage
- Validates user status (ativo, bloqueado, inativo)
- Accepts any password for demo users

**Demo Users:**
```
Admin:       admin@escola.com
Coordenador: coordenador@escola.com
Instrutor:   instrutor@escola.com
Password:    any value
```

### Type System

All types defined in `lib/types.ts`:

**Core Types:**
- `UserRole`: 'admin' | 'coordenador' | 'instrutor'
- `Usuario`, `Admin`, `Coordenador`, `Instrutor`
- `Curso`, `Turma`, `Aluno`, `Interessado`
- `DiarioAula`, `RegistroPresenca`, `AnotacaoAluno`
- `MetricasTurma`, `MetricasGerais`, `MetricasInstrutor`

**Status Types:**
- `StatusUsuario`: 'ativo' | 'bloqueado' | 'inativo'
- `StatusTurma`: 'planejada' | 'em_andamento' | 'finalizada' | 'cancelada'
- `StatusAluno`: 'ativo' | 'inativo' | 'concluido' | 'evadido'
- `StatusPresenca`: 'presente' | 'ausente' | 'abonado' | 'justificado'

### Form Validation Schemas

All schemas in `lib/schemas.ts` using Zod:
- `ementaSchema` - **Ementa (curriculum) with nested aulas and avaliacoes** ⭐ NEW
- `aulaEmentaSchema` - **Individual class within ementa** ⭐ NEW
- `avaliacaoEmentaSchema` - **Assessment definition** ⭐ NEW
- `alunoSchema` - Student registration
- `turmaSchema` - Class creation **(now requires ementaId)** ⭐ UPDATED
- `instrutorSchema` - Instructor registration
- `coordenadorSchema` - Coordenador registration
- `interessadoSchema` - Lead capture
- `diarioAulaSchema` - Class diary entry
- `anotacaoAlunoSchema` - Student notes
- `cancelamentoAulaSchema` - Class cancellation
- `loginSchema` - Login validation

### Mock Data

All demo data in `lib/mock-data.ts`:
- `mockUsuarios` - 3 users (admin, coordenador, instrutor)
- `mockInstrutores` - 3 instructors with specialties
- `mockCursos` - 3 complete courses
- **`mockEmentas` - 3 complete ementas with classes and assessments** ⭐ NEW
  - Desenvolvimento Web (5 classes, 3 assessments, 120h)
  - Design UX/UI (3 classes, 3 assessments, 80h)
  - Python Data Science (3 classes, 3 assessments, 100h)
- `mockTurmas` - 4 classes **(linked to ementas)** ⭐ UPDATED
- `mockAlunos` - Student samples
- `mockInteressados` - Leads
- `mockDiarios` - Class diary examples
- `mockMetricasGerais` - Global metrics

### Data Management Context ⭐ NEW

**`lib/data-context.tsx`** provides full CRUD operations with localStorage persistence:

```tsx
import { useData } from '@/lib/data-context';

const {
  // Ementas
  ementas,              // All ementas
  addEmenta,            // Create new ementa
  updateEmenta,         // Update existing ementa
  deleteEmenta,         // Delete ementa
  getEmenta,            // Get ementa by ID
  getEmentasByCurso,    // Filter ementas by course

  // Turmas
  turmas, addTurma, updateTurma, deleteTurma, getTurma,

  // Alunos
  alunos, addAluno, updateAluno, deleteAluno, getAluno,

  // Instrutores
  instrutores, addInstrutor, updateInstrutor, deleteInstrutor, getInstrutor,

  // Interessados
  interessados, addInteressado, updateInteressado, deleteInteressado,

  // Cursos (read-only)
  cursos,
} = useData();
```

**Features:**
- ✅ Auto-increment IDs (timestamp-based)
- ✅ Automatic timestamps (dataCriacao, dataAtualizacao)
- ✅ localStorage persistence
- ✅ Simulates real backend behavior

## Component Patterns

### Form Components
All forms must use **react-hook-form + Zod**:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { alunoSchema, type AlunoFormData } from '@/lib/schemas';

const form = useForm<AlunoFormData>({
  resolver: zodResolver(alunoSchema),
  defaultValues: { ... }
});
```

### Button Variants
Use appropriate variants for visual hierarchy:
- `default` - Primary blue actions
- `accent` - Orange highlight actions
- `outlinePrimary` - Secondary blue actions
- `ghost` - Subtle actions
- `destructive` - Delete/remove actions

### Badge Variants
For status indicators:
- `default` - Primary status (blue)
- `accent` - Highlighted status (orange)
- `success` - Positive status (green)
- `warning` - Warning status (yellow)
- `destructive` - Negative status (red)

### Layout Structure
Each role has its own layout with sidebar:
```tsx
// app/[role]/layout.tsx
<div className="flex">
  <Sidebar role={user.role} />
  <main className="flex-1 p-6">
    {children}
  </main>
</div>
```

## Key Features by Role

### Admin Features
1. Dashboard with system-wide metrics
2. Coordenador management (CRUD + block/unblock)
3. All Coordenador features

### Coordenador Features
1. Dashboard with turma metrics
2. Turma management (CRUD, cancel classes, finalize)
3. Aluno management (CRUD, assign to turmas)
4. Instrutor management (register, view)
5. Interessados list (leads)
6. PDF report generation (monthly)

### Instrutor Features
1. Dashboard showing assigned turmas
2. Class diary (attendance, content, summary)
3. Student history view
4. Student notes (private and shared)
5. Absence justification approval

## Data Visualization

### Metrics Components
- **MetricCard**: Display single metric with icon and trend
- **BarChart**: Class statistics, enrollment trends
- **PieChart**: Status distribution, course popularity
- **LineChart**: Attendance over time, performance trends

### Table Components
- Pagination support
- Sorting capabilities
- Status badges
- Action buttons (edit, delete, view)

## File Organization

```
futuroon/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Login page
│   ├── globals.css             # Tailwind + theme variables
│   ├── admin/                  # Admin routes
│   ├── coordenador/            # Coordenador routes
│   └── instrutor/              # Instrutor routes
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layouts/                # Layout components
│   ├── forms/                  # Form components
│   ├── dashboard/              # Dashboard widgets
│   └── charts/                 # Data visualization
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── schemas.ts              # Zod validation schemas
│   ├── mock-data.ts            # Demo data
│   ├── auth-context.tsx        # Authentication context
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## Important Guidelines

### When Creating New Features
1. Define types in `lib/types.ts` first
2. Create Zod schema in `lib/schemas.ts`
3. Add mock data to `lib/mock-data.ts`
4. Build form with react-hook-form + Zod
5. Use appropriate button/badge variants
6. Follow role-based routing structure

### When Building Forms
- Always use react-hook-form with zodResolver
- Show field-level errors
- Disable submit while loading
- Show success/error feedback
- Use appropriate input components from shadcn/ui

### When Displaying Data
- Use tables for lists (with pagination)
- Use cards for metrics
- Use badges for status
- Use charts for trends
- Maintain white space and readability

### Color Usage
- **Blue (#2C5282)**: Primary actions, active states, main CTAs
- **Orange (#DD6B20)**: Secondary CTAs, important highlights, chart accents
- **Green**: Success states, completed status
- **Yellow**: Warning states, pending status
- **Red**: Error states, blocked status

## Code Style

### Naming Conventions
- Components: PascalCase (`AlunoForm.tsx`)
- Files: kebab-case for non-components (`mock-data.ts`)
- Types: PascalCase (`Usuario`, `StatusTurma`)
- Functions: camelCase (`handleSubmit`, `formatCPF`)

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Local components
4. Types
5. Utils/helpers
6. Styles

## Current State

### ✅ Completed
- Project configuration (package.json, Tailwind, theme)
- Type system (complete TypeScript types)
- Validation schemas (Zod for all forms)
- Mock data (users, turmas, alunos, metrics)
- UI components (Button, Badge with variants)
- Authentication system (mock with Context API)
- Login page
- Root layout with AuthProvider

### 🚧 In Progress
- Route structure for all roles
- Layout components with sidebar
- Dashboard pages for each role
- CRUD forms for all entities
- Data visualization components

### 📋 TODO
- Admin dashboard and coordenador management
- Coordenador pages (turmas, alunos, instrutores, relatorios)
- Instrutor pages (diario, turmas, alunos)
- Charts and metrics components
- PDF report generation
- Remove old banking system code

## Development Notes

1. **This is a UI prototype** - Focus on interface validation, not production-ready backend
2. **All forms must work** - Use react-hook-form + Zod for validation
3. **Role-based routing** - Each user type has different routes and permissions
4. **Professional design** - Clean, minimalist, data-focused interface
5. **Portuguese language** - All UI text should be in Brazilian Portuguese

## References

For adding new features, always check:
- `lib/types.ts` for type definitions
- `lib/schemas.ts` for validation patterns
- `lib/mock-data.ts` for data structure examples
- Component variants in `components/ui/` for styling patterns
