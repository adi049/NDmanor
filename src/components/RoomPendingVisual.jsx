import { Monogram } from './Logo';

export default function RoomPendingVisual({ room, detail = false }) {
  return (
    <div className={`room-pending-visual ${detail ? 'room-pending-visual--detail' : ''}`}>
      <div className="room-pending-visual__frame">
        <Monogram className="room-pending-visual__mark" />
        <span>Room {room.number} · ND Manor</span>
        <strong>Category photography pending</strong>
        <small>Only verified {room.name} photographs will be published.</small>
      </div>
    </div>
  );
}
