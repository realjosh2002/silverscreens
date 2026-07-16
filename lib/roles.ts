// ─── SilverScreens — Departments & Roles ─────────────────────────────────────
// Single source of truth. Import this file across all pages.
// Aspirants: multiple departments, max 5 roles total.
// Casting calls: one department + one role per call.

export interface DepartmentRoles {
  department: string;
  roles: string[];
}

export const DEPARTMENTS_AND_ROLES: DepartmentRoles[] = [
  {
    department: 'Acting',
    roles: ['Hero', 'Heroine', 'Villain', 'Comedian', 'Character Artist', 'Supporting Roles', 'Child Artist'],
  },
  {
    department: 'Direction',
    roles: ['Director', 'Assistant Director'],
  },
  {
    department: 'Production Office',
    roles: [
      'Line Producer', 'Production Assistant', 'Production Manager',
      'Asst. Production Manager', 'Unit Manager', 'Production Coordinator',
      'First Assistant Director', 'Second Assistant Director',
    ],
  },
  {
    department: 'Accounting',
    roles: ['Production Accountant'],
  },
  {
    department: 'Locations',
    roles: [
      'Location Manager', 'Asst. Location Manager', 'Location Scout',
      'Location Assistant', 'Location Production Assistant',
    ],
  },
  {
    department: 'Continuity',
    roles: ['Script Supervisor'],
  },
  {
    department: 'Casting',
    roles: ['Casting Director', 'Casting PA'],
  },
  {
    department: 'Camera & Lighting',
    roles: [
      'Director of Photography', 'Camera Operator', 'First Assistant Camera',
      'Second Assistant Camera', 'Film Loader', 'Digital Imaging Technician',
      'Motion Control Technician', 'Gaffer', 'Best Boy', 'Lighting Technician',
    ],
  },
  {
    department: 'Grip',
    roles: ['Key Grip', 'Best Boy', 'Dolly Grip', 'Grips', 'Sound Grip'],
  },
  {
    department: 'Sound',
    roles: ['Production Sound Mixer', 'Boom Operator', 'Second Assistant Sound'],
  },
  {
    department: 'Art',
    roles: [
      'Production Designer', 'Art Director', 'Standby Art Director',
      'Assistant Art Director', 'Set Designer', 'Illustrator', 'Graphic Artist',
    ],
  },
  {
    department: 'Sets',
    roles: ['Set Decorator', 'Buyer', 'Leadman', 'Set Dresser', 'Greensman'],
  },
  {
    department: 'Construction',
    roles: ['Construction Coordinator', 'Head Carpenter', 'Propmaker'],
  },
  {
    department: 'Scenic',
    roles: ['Key Scenic', 'Head of Plaster'],
  },
  {
    department: 'Property',
    roles: ['Propmaster', 'Weapons Master'],
  },
  {
    department: 'Costume',
    roles: [
      'Costume Designer', 'Costume Supervisor', 'Key Costumer',
      'Costume Standby', 'Breakdown Artist', 'Costume Buyer', 'Cutter',
    ],
  },
  {
    department: 'Hair & Make Up',
    roles: [
      'Key Make Up Artist', 'Special Make Up Effects', 'Make Up Supervisor',
      'Make Up Artist', 'Key Hair', 'Hair Stylist',
    ],
  },
  {
    department: 'Special Effects',
    roles: ['Special Effects Supervisor', 'Special Effects Assistant'],
  },
  {
    department: 'Stunt',
    roles: ['Stunt Master', 'Stunt Coordinator'],
  },
  {
    department: 'Post Production',
    roles: ['Post Production Supervisor'],
  },
  {
    department: 'Editorial',
    roles: ['Film Editor', 'Negative Cutter', 'Colorist', 'Telecine Colorist'],
  },
  {
    department: 'Visual Effects',
    roles: [
      'Visual Effects Producer', 'VFX Creative Director', 'VFX Supervisor',
      'VFX Editor', 'Composer', 'Rotoscope Artist', 'Paint Artist', 'Matte Painter',
    ],
  },
  {
    department: 'Sound & Music',
    roles: [
      'Sound Designer', 'Dialogue Editor', 'Sound Editor', 'Re-Recording Mixer',
      'Music Supervisor', 'Music Composer / Director', 'Foley Artist',
      'Conductor / Orchestrator', 'Sound Recorder / Mixer',
      'Music Preparation', 'Music Editor',
    ],
  },
  {
    department: 'Animation',
    roles: ['Animation Artist'],
  },
  {
    department: 'Electrical',
    roles: ['Electrician', 'Digital Intermediate Technician'],
  },
  {
    department: 'Singing',
    roles: ['Singer'],
  },
  {
    department: 'Dancing',
    roles: ['Dancer'],
  },
  {
    department: 'Dubbing',
    roles: ['Dubbing Artist'],
  },
  {
    department: 'Story',
    roles: ['Story Writer'],
  },
  {
    department: 'Television',
    roles: ['Anchoring', 'Newsreader', 'Talk Show', 'Stage Show', 'Drama', 'Production Crew'],
  },
  {
    department: 'Modelling',
    roles: ['Model', 'Advertisement'],
  },
  {
    department: 'Advertisement',
    roles: ['Advertisement'],
  },
  {
    department: 'Food',
    roles: ['Food Supplier / Caterer'],
  },
  {
    department: 'Transport',
    roles: ['Cab Service Provider', 'Caravan Service Provider'],
  },
  {
    department: 'Travels',
    roles: ['Ticketing Agents', 'Hotels'],
  },
  {
    department: 'Distributor',
    roles: ['Distributors'],
  },
];

// ─── Helper: all department names (for dropdowns) ────────────────────────────
export const ALL_DEPARTMENTS: string[] = DEPARTMENTS_AND_ROLES.map(d => d.department);

// ─── Helper: get roles for a given department ────────────────────────────────
export const getRoles = (department: string): string[] => {
  const found = DEPARTMENTS_AND_ROLES.find(d => d.department === department);
  return found ? found.roles : [];
};

// ─── Helper: all roles flat (for search/filter) ──────────────────────────────
export const ALL_ROLES: string[] = DEPARTMENTS_AND_ROLES.flatMap(d => d.roles);

// ─── Helper: find department for a given role ────────────────────────────────
export const getDepartmentForRole = (role: string): string => {
  const found = DEPARTMENTS_AND_ROLES.find(d => d.roles.includes(role));
  return found ? found.department : '';
};

// ─── Max roles an aspirant can select across all departments ─────────────────
export const MAX_ROLES = 5;