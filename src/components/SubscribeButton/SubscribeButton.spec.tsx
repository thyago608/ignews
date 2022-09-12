import { screen, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { signIn } from "next-auth/client";
import { SubscribeButton } from ".";

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
    signIn: jest.fn(),
  };
});

describe("Component SubscribeButton", () => {
  it("should render correctly", () => {
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("should redirects user to sign in when not authenticated", () => {
    const signInMocked = jest.mocked(signIn);

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });
});
