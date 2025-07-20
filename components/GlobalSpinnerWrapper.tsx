"use client";
import { useLoading } from "../app/providers";
import Spinner from "./ui/Spinner";

export default function GlobalSpinnerWrapper() {
  const { loading } = useLoading();
  if (!loading) return null;
  return <Spinner overlay />;
}
