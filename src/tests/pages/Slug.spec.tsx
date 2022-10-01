import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSession } from "next-auth/client";
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
});
