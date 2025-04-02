import { ColdEmailNode } from "@/components/workflow/nodes/cold-email-node";
import { LeadSourceNode } from "@/components/workflow/nodes/lead-source-node";
import { DelayNode } from "@/components/workflow/nodes/delay-node";

import { type ClassValue, clsx } from "clsx"
import { Node } from "reactflow";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'leadSource',
    position: { x: 250, y: 0 },
    data: { label: 'Lead Source' },
  },
];

export const nodeTypes = {
  coldEmail: ColdEmailNode,
  wait: DelayNode,
  leadSource: LeadSourceNode,
};