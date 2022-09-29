import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("next-auth/client", () => ({
  useSession: () => [null, false],
}));

jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ amount: "R$10,00", priceId: "fake-price-id" }} />);

    const paragraph = screen.getByRole("presentation");
    const price = paragraph.querySelector("span");

    expect(price).toHaveTextContent("for R$10,00");
  });

  it("loads initial data", async () => {
    const retriveStripePricesMocked = jest.mocked(stripe.prices.retrieve);

    //mockResolvedValueOnce: Função utilizada para mockar o retorno de uma função assíncrona
    retriveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    //Espero que response seja um objeto contendo tais informações
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
