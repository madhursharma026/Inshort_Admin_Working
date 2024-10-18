import { APIURL } from "./api/hello";
import { useRouter } from "next/router";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);

  async function formSubmit(e) {
    e.preventDefault();

    const query = `
      mutation CreateArticle($input: CreateArticleInput!) {
        createArticle(createArticleInput: $input) {
          id
          title
          description
          imageURL
        }
      }
    `;

    const variables = {
      input: {
        title,
        imageURL,
        description,
      },
    };

    try {
      const response = await fetch(APIURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      alert("Data Saved Successfully");
      setTitle("");
      setImageURL("");
      setDescription("");
      router.push("/viewarticles");
    } catch (error) {
      alert("Error submitting form:", error);
    }
  }

  return (
    <>
      <Header />
      <div className="container-lg px-md-5 px-3 mt-3">
        <form className="px-sm-5 mx-lg-5" onSubmit={formSubmit}>
          <h1 className="text-center mb-5">
            <u>Article Details</u>
          </h1>
          <div className="mb-3">
            <label htmlFor="Title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="Title"
              value={title}
              autoComplete="off"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Description" className="form-label">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              required
              style={{ height: "150px" }}
            />
          </div>
          <div className="mb-3 pt-3 mt-5">
            <label htmlFor="ImageURL" className="form-label">
              Image URL
            </label>
            <input
              type="text"
              className="form-control"
              id="ImageURL"
              value={imageURL}
              autoComplete="off"
              onChange={(e) => setImageURL(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
