'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRole, type Role } from '@/contexts/role-context';
import { User, Shield, Handshake, Sprout } from 'lucide-react';

const roles = [
  { value: 'admin', label: 'Admin', icon: Shield },
  { value: 'staff', label: 'Staff', icon: User },
  { value: 'donor', label: 'Donor', icon: Handshake },
  { value: 'recipient', label: 'Recipient', icon: Sprout },
];

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  const SelectedIcon = roles.find((r) => r.value === role)?.icon;

  return (
    <Select value={role} onValueChange={(value) => setRole(value as Role)}>
      <SelectTrigger className="w-[180px] hidden md:flex">
        <div className="flex items-center gap-2">
          {SelectedIcon && <SelectedIcon className="h-4 w-4 text-muted-foreground" />}
          <SelectValue placeholder="Select a role" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {roles.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            <div className="flex items-center gap-2">
              <r.icon className="h-4 w-4" />
              <span>{r.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
