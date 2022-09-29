import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../pages";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("next-auth/client", () => ({
  useSession: () => [null, false],
}));

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ amount: "R$10,00", priceId: "fake-price-id" }} />);

    const paragraph = screen.getByRole("presentation");
    const price = paragraph.querySelector("span");

    expect(price).toHaveTextContent("for R$10,00");
  });
});
