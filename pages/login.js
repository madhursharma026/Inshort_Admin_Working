import { APIURL } from "./api/hello";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      router.push("/");
    }
  }, [router]);

  async function formSubmit(e) {
    e.preventDefault();
    const query = `
        mutation login($loginUserInput: LoginUserInput!) {
            login(loginUserInput: $loginUserInput) {
                access_token
                user {
                    id
                    username
                    password
                }
            }
        }
    `;

    const variables = {
      loginUserInput: {
        username,
        password,
      },
    };

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
    if (result.errors != null) {
      alert(result.errors[0].message);
    } else {
      localStorage.setItem("access_token", result.data.login.access_token);
      alert("Login Successfully");
      setUsername("");
      setPassword("");
      router.push("/");
    }
  }

  return (
    <div className="container-lg px-md-5 px-3 mt-3">
      <h1 className="text-center mb-5">
        <u>Login</u>
      </h1>
      <form className="px-sm-5 mx-lg-5" onSubmit={formSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    </div>
  );
}
