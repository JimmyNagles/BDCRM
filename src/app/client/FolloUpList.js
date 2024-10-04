import FollowUpCard from "@/components/FollowUpCard";

export default function FollowUpList({ followUps }) {
  if (followUps.length === 0) {
    return <p>No follow-ups yet for this client.</p>;
  }

  return (
    <ul>
      {followUps.map((followUp) => (
        <li className="mt-2 mb-2 shadow-2xl" key={followUp.id}>
          <FollowUpCard followUp={followUp} />
        </li>
      ))}
    </ul>
  );
}
