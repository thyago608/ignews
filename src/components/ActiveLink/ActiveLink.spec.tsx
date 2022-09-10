import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("Component ActiveLink", () => {
  it("should render correctly", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("should be possible to receive the active class", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toHaveClass("active");
  });
});
