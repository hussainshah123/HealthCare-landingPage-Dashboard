export const TOPICS = ["CUSTOMER", "PHARMACY", "DOCTOR", "RIDER", "OTHER"] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_OPTIONS: { value: Topic; label: string; hint: string }[] = [
  { value: "CUSTOMER", label: "I'm a customer", hint: "Orders, deliveries or consultations" },
  { value: "PHARMACY", label: "Pharmacy partner", hint: "List your pharmacy on MediGo" },
  { value: "DOCTOR", label: "Doctor", hint: "Consult patients online" },
  { value: "RIDER", label: "Rider", hint: "Deliver with MediGo" },
  { value: "OTHER", label: "Something else", hint: "Press, partnerships, anything" },
];

export function isTopic(v: string | null | undefined): v is Topic {
  return !!v && (TOPICS as readonly string[]).includes(v);
}
