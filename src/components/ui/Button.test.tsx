import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-brand-primary");
  });

  it("applies danger variant classes", () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-status-error");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Cancel</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-brand-surface");
  });

  it("shows loading spinner when loading=true and hides children text", () => {
    render(<Button loading loadingText="Saving...">Save</Button>);
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading=true", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick handler when clicked", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Save</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>Save</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });
});
