"use client";
import Spinner from "./ui/Spinner";
import { useLoading } from "../app/providers";

export default function GlobalSpinnerWrapper() {
  const { loading } = useLoading();
  if (!loading) return null;
  return <Spinner overlay />;
}
