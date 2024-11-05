import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";
import { APIURL } from "./api/hello";
import { useRouter } from "next/router";
import Header from "./components/Header";
import "react-quill/dist/quill.snow.css";
import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ViewArticles = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articleData, setArticleData] = useState([]);
  const [description, setDescription] = useState("");
  const [currentArticleId, setCurrentArticleId] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);

  const ALL_ARTICLES_QUERY = `
    query {
      articles {
        id
        title
        status
        imageURL
        createdAt
        description
      }
    }
  `;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.post(APIURL, {
          query: ALL_ARTICLES_QUERY,
        });
        const articles = response.data.data.articles;
        setArticleData(articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const UPDATE_ARTICLES_MUTATION = `
    mutation UpdateArticle($id: Int!, $updateArticleInput: UpdateArticleInput!) {
      updateArticle(id: $id, updateArticleInput: $updateArticleInput) {
        id
        title
        status
        createdAt
      }
    }
  `;

  const handleToggleStatus = async (articleId, currentStatus) => {
    const articleStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.post(APIURL, {
        query: UPDATE_ARTICLES_MUTATION,
        variables: {
          id: articleId,
          updateArticleInput: { status: articleStatus },
        },
      });
      // Update the specific news item in the state
      setArticleData((prevData) =>
        prevData.map((article) =>
          article.id === articleId
            ? { ...article, status: articleStatus }
            : article
        )
      );
      alert(
        `Article ${
          currentStatus === "active" ? "deleted" : "restored"
        } successfully!`
      );
    } catch (error) {
      console.error("Error updating article status:", error);
    }
  };

  const handleShow = (newsId, newsTitle, newsDescription) => {
    setCurrentArticleId(newsId);
    setTitle(newsTitle);
    setDescription(newsDescription);
    setShow(true);
  };

  const handleEditArticle = async () => {
    try {
      await axios.post(APIURL, {
        query: UPDATE_ARTICLES_MUTATION,
        variables: {
          id: currentArticleId,
          updateArticleInput: {
            title,
            description,
          },
        },
      });
      setArticleData((prevData) =>
        prevData.map((article) =>
          article.id === currentArticleId
            ? {
                ...article,
                title: title,
                description: description,
              }
            : article
        )
      );
      setShow(false);
      alert("Article updated successfully!");
    } catch (error) {
      console.error("Error while updating article:", error);
    }
  };

  // Handle click on the anchor tag in the description
  const handleDescriptionClick = (event) => {
    const target = event.target;
    if (target.tagName === "A") {
      event.preventDefault(); // Prevent default anchor click behavior
      const articleId = target.getAttribute("href").split("article ")[1];
      if (articleId) {
        // Open the single article page in a new tab
        window.open(`/singlearticle?id=${articleId}`, "_blank"); // Open in a new tab
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container-lg px-md-5 px-3 mt-3">
        <h1 className="mb-4 text-center">
          <u>Articles</u>
        </h1>

        {loading ? (
          <p className="text-center">Loading articles...</p>
        ) : articleData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th
                    className="d-none d-lg-table-cell"
                    style={{ minWidth: "200px" }}
                  >
                    Image
                  </th>
                  <th style={{ minWidth: "200px" }}>Title</th>
                  <th
                    className="d-none d-md-table-cell"
                    style={{ minWidth: "300px" }}
                  >
                    Description
                  </th>
                  <th style={{ minWidth: "150px" }}>Action</th>
                  <th
                    className="d-none d-xl-table-cell"
                    style={{ minWidth: "150px" }}
                  >
                    Published At
                  </th>
                </tr>
              </thead>
              <tbody>
                {articleData.map((article) => (
                  <tr key={article.id}>
                    <td className="d-none d-lg-table-cell">
                      <Image
                        width={100}
                        height={50}
                        alt={article.title}
                        src={article.imageURL}
                        style={{ objectFit: "cover" }}
                      />
                    </td>
                    <td>{article.title}</td>
                    <td className="d-none d-md-table-cell">
                      <div
                        onClick={handleDescriptionClick} // Add click handler here
                        dangerouslySetInnerHTML={{
                          __html: article.description,
                        }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-warning w-100 mt-2"
                        onClick={() =>
                          handleShow(
                            article.id,
                            article.title,
                            article.description
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`btn w-100 mt-2 ${
                          article.status === "active"
                            ? "btn-danger"
                            : "btn-info"
                        }`}
                        onClick={() =>
                          handleToggleStatus(article.id, article.status)
                        }
                      >
                        {article.status === "active" ? "Delete" : "Restore"}
                      </button>
                    </td>
                    <td className="d-none d-xl-table-cell">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-center">No articles available.</h1>
        )}
      </div>
      <Modal
        centered
        size="lg"
        show={show}
        keyboard={false}
        backdrop="static"
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer className="mt-5">
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditArticle}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewArticles;
