import { useEffect, useState } from "react";
import { APIURL } from "./api/hello";
import { useRouter } from "next/router";
import Header from "./components/Header";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddNews() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [priority, setPriority] = useState("");
  const [sourceURL, setSourceURL] = useState("");
  const [language, setLanguage] = useState("en");
  const [description, setDescription] = useState("");
  const [readMoreContent, setReadMoreContent] = useState("");
  const [sourceURLFormate, setSourceURLFormate] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);

  async function formSubmit(e) {
    e.preventDefault();

    const query = `
      mutation CreateNews($input: CreateNewsInput!) {
        createNews(createNewsInput: $input) {
          id
          url
          title
          author
          priority
          language
          sourceURL
          description
          publishedAt
          readMoreContent
          sourceURLFormate
        }
      }
    `;

    const variables = {
      input: {
        url,
        title,
        author,
        priority,
        language,
        sourceURL,
        description,
        readMoreContent,
        sourceURLFormate,
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
      setUrl("");
      setTitle("");
      setAuthor("");
      setPriority("");
      setSourceURL("");
      setLanguage("en");
      setDescription("");
      setReadMoreContent("");
      setSourceURLFormate("");
      router.push("/");
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
            <u>News Details</u>
          </h1>
          <div className="mb-3">
            <label htmlFor="Language" className="form-label">
              Language
            </label>
            <select
              id="Language"
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="Priority" className="form-label">
              Priority
            </label>
            <select
              id="Priority"
              className="form-select"
              value={priority}
              defaultValue={"low"}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
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
            {/* <textarea
              rows={3}
              className="form-control"
              id="Description"
              autoComplete="off"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            /> */}
          </div>
          <div className="mb-3 mt-5">
            <label htmlFor="ReadMoreContent" className="form-label">
              Read More Content
            </label>
            <textarea
              rows={3}
              className="form-control"
              id="ReadMoreContent"
              autoComplete="off"
              value={readMoreContent}
              onChange={(e) => setReadMoreContent(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Author" className="form-label">
              Author
            </label>
            <input
              type="text"
              className="form-control"
              id="Author"
              value={author}
              autoComplete="off"
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="PageURL" className="form-label">
              Page URL
            </label>
            <input
              type="text"
              className="form-control"
              id="PageURL"
              value={url}
              autoComplete="off"
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="SourceURLFormate" className="form-label">
              Source URL Formate
            </label>
            <select
              id="SourceURLFormate"
              className="form-select"
              value={sourceURLFormate}
              onChange={(e) => setSourceURLFormate(e.target.value)}
              required
            >
              <option value="">Select Source URL Formate</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="SourceURL" className="form-label">
              Source URL
            </label>
            <input
              type="text"
              className="form-control"
              id="SourceURL"
              value={sourceURL}
              autoComplete="off"
              onChange={(e) => setSourceURL(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
