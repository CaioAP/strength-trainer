import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmationModal from "./ConfirmationModal";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  title: "Are you sure?",
  message: "This action cannot be undone.",
};

describe("ConfirmationModal", () => {
  it("renders nothing when isOpen=false", () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog with title and message when open", () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("has aria-modal=true and aria-labelledby pointing to title", () => {
    render(<ConfirmationModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
    expect(screen.getByText("Are you sure?")).toHaveAttribute("id", "modal-title");
  });

  it("calls onClose when Cancel button clicked", async () => {
    const onClose = vi.fn();
    render(<ConfirmationModal {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onConfirm when Confirm button clicked", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmationModal {...defaultProps} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onClose on Escape key press", async () => {
    const onClose = vi.fn();
    render(<ConfirmationModal {...defaultProps} onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose on Escape when isLoading=true", async () => {
    const onClose = vi.fn();
    render(<ConfirmationModal {...defaultProps} onClose={onClose} isLoading />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders children when provided", () => {
    render(
      <ConfirmationModal {...defaultProps}>
        <p>Extra content</p>
      </ConfirmationModal>
    );
    expect(screen.getByText("Extra content")).toBeInTheDocument();
  });

  it("uses custom confirmText and cancelText", () => {
    render(
      <ConfirmationModal
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /keep/i })).toBeInTheDocument();
  });
});
