import { notFound } from "next/navigation";

export function getOr404<T>(data: T | null | undefined): T {
  if (!data) {
    notFound();
  }
  return data;
}