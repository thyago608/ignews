import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSession } from "next-auth/client";
import { getPrismicClient } from "../../services/prismic";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";

const post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post content</p>",
  updatedAt: "10 de Abril",
};

jest.mock("next-auth/client");
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));
jest.mock("../../services/prismic");

describe("Slug Page", () => {
  it("renders correctly when not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={post} />);

    const article = screen.getByRole("article");
    const postContent = article.querySelector("div .postContent");

    expect(postContent).toBeInTheDocument();
    expect(postContent).toHaveClass("notRegistered");
  });

  it("renders correctly when authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
        activeSubscription: "fake-subscription",
        expires: "fake-expires",
      },
      false,
    ]);

    render(<Post post={post} />);

    const article = screen.getByRole("article");
    const postClass = article.querySelector("div .postContent")?.className;

    expect(postClass).toEqual("postContent ");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: "heading",
              text: "My new post",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "Post content",
            },
          ],
        },
        last_publication_date: "04-10-2021",
      }),
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "my-new-post",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post content</p>",
            updatedAt: "10 de abril de 2021",
          },
        },
      })
    );
  });
});
