import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

describe("Component Header", () => {
  it("should render component", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
