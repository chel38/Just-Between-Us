import { Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { DialogueDefinition, DialogueProgress, RelationshipKey } from '../types/dialogue';

interface Props {
  dialogue: DialogueDefinition;
  progress: DialogueProgress;
  onProgress: (progress: DialogueProgress) => void;
  onClear: () => void;
}

export function DialogueDebugger({ dialogue, progress, onProgress, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const jump = (nodeId: string) => onProgress({ ...progress, currentNodeId: nodeId, awaitingChoice: false, endingId: undefined, status: 'active', processedMessageIds: [], seenNodes: [...new Set([...progress.seenNodes, nodeId])], updatedAt: Date.now() });
  const changeRelationship = (key: RelationshipKey, value: number) => onProgress({ ...progress, relationship: { ...progress.relationship, [key]: value }, updatedAt: Date.now() });
  return (
    <aside className={`debugger ${open ? 'is-open' : ''}`}>
      <button className="debugger__toggle" onClick={() => setOpen(!open)}><Bug size={16} /> Debug {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}</button>
      {open && <div className="debugger__body">
        <label>Node<select value={progress.currentNodeId} onChange={(event) => jump(event.target.value)}>{dialogue.nodes.map((node) => <option key={node.id}>{node.id}</option>)}</select></label>
        <div className="debugger__stats">{Object.entries(progress.relationship).map(([key, value]) => <label key={key}>{key}<input type="number" min="-10" max="20" value={value} onChange={(event) => changeRelationship(key as RelationshipKey, Number(event.target.value))} /></label>)}</div>
        <label>Flags<textarea value={progress.flags.join('\n')} onChange={(event) => onProgress({ ...progress, flags: event.target.value.split('\n').filter(Boolean), updatedAt: Date.now() })} /></label>
        <button onClick={onClear}>Clear dialogue save</button>
      </div>}
    </aside>
  );
}
