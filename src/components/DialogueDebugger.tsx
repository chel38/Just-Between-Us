import { Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { UiLanguage } from '../content/locales';
import type { DeviceType, Orientation, RewardedSimulation } from '../platform/platform';
import type { DialogueDefinition, DialogueProgress, RelationshipKey } from '../types/dialogue';

interface Props {
  dialogue: DialogueDefinition;
  progress: DialogueProgress;
  language: UiLanguage;
  deviceType: DeviceType;
  orientation: Orientation;
  stickyVisible: boolean;
  onProgress: (progress: DialogueProgress) => void;
  onClear: () => void;
  onLanguageChange: (language: UiLanguage) => void;
  onDeviceChange: (device: DeviceType) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onStickyShow: () => Promise<void>;
  onStickyHide: () => Promise<void>;
  onRewardedSimulation: (result: RewardedSimulation) => void;
}

export function DialogueDebugger(props: Props) {
  const [open, setOpen] = useState(false);
  const { dialogue, progress, onProgress } = props;
  const jump = (nodeId: string) => onProgress({ ...progress, currentNodeId: nodeId, awaitingChoice: false, endingId: undefined, status: 'active', processedMessageIds: [], seenNodes: [...new Set([...progress.seenNodes, nodeId])], updatedAt: Date.now() });
  const changeRelationship = (key: RelationshipKey, value: number) => onProgress({ ...progress, relationship: { ...progress.relationship, [key]: value }, updatedAt: Date.now() });
  return (
    <aside className={`debugger ${open ? 'is-open' : ''}`}>
      <button className="debugger__toggle" onClick={() => setOpen(!open)}><Bug size={16} /> Debug {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}</button>
      {open && <div className="debugger__body">
        <label>Node<select value={progress.currentNodeId} onChange={(event) => jump(event.target.value)}>{dialogue.nodes.map((node) => <option key={node.id}>{node.id}</option>)}</select></label>
        <label>Language<select value={props.language} onChange={(event) => props.onLanguageChange(event.target.value as UiLanguage)}><option value="ru">RU</option><option value="en">EN</option></select></label>
        <label>Device<select value={props.deviceType} onChange={(event) => props.onDeviceChange(event.target.value as DeviceType)}>{(['mobile', 'tablet', 'desktop', 'tv'] as const).map((device) => <option key={device}>{device}</option>)}</select></label>
        <label>Orientation<select value={props.orientation} onChange={(event) => props.onOrientationChange(event.target.value as Orientation)}><option>portrait</option><option>landscape</option></select></label>
        <div className="debugger__actions"><span>Sticky: {props.stickyVisible ? 'shown' : 'hidden'}</span><button onClick={() => void props.onStickyShow()}>Show</button><button onClick={() => void props.onStickyHide()}>Hide</button></div>
        <label>Rewarded<select defaultValue="reward" onChange={(event) => props.onRewardedSimulation(event.target.value as RewardedSimulation)}><option value="reward">Reward success</option><option value="close">Close without reward</option><option value="error">Error</option></select></label>
        <div className="debugger__stats">{Object.entries(progress.relationship).map(([key, value]) => <label key={key}>{key}<input type="number" min="-10" max="20" value={value} onChange={(event) => changeRelationship(key as RelationshipKey, Number(event.target.value))} /></label>)}</div>
        <label>Flags<textarea value={progress.flags.join('\n')} onChange={(event) => onProgress({ ...progress, flags: event.target.value.split('\n').filter(Boolean), updatedAt: Date.now() })} /></label>
        <button onClick={props.onClear}>Clear dialogue save</button>
      </div>}
    </aside>
  );
}
