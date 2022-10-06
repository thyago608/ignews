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

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        data: null,
        status: "loading",
      };
    },
  };
});

describe("Component Header", () => {
  it("should render component", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
