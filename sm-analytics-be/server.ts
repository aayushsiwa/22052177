import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
const PORT = 3000;

const API_BASE_URL = "http://20.244.56.144/evaluation-service";
const AUTH_URL = `${API_BASE_URL}/auth`;

const authPayload = {
    email: "aayush13402@gmail.com",
    name: "aayush siwach",
    rollNo: "22052177",
    accessCode: "nwpwrZ",
    clientID: "47405b79-d0a0-4a67-b72e-c4514aadbfd1",
    clientSecret: "CBqTPEKXMkeCtsgY",
};

let bearerToken = null;
let tokenExpiry = 0;
const fetchBearerToken = async () => {
    try {
        const response = await axios.post(AUTH_URL, authPayload, {
            headers: { "Content-Type": "application/json" },
        });

        bearerToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000;

        console.log("✅ Bearer token fetched successfully.");
        console.log(
            "⏳ Token expires at:",
            new Date(tokenExpiry).toLocaleString()
        );
    } catch (error) {
        console.error("❌ Error fetching token:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
    }
};
const ensureValidToken = async () => {
    if (!bearerToken || Date.now() >= tokenExpiry) {
        console.log("🔄 Token expired or missing. Fetching a new one...");
        await fetchBearerToken();
    }
};
const getApiClient = async () => {
    await ensureValidToken();
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
        },
    });
};

app.get("/users", async (req, res) => {
    try {
        const apiClient = await getApiClient();
        const usersRes = await apiClient.get("/users");
        const usersData = usersRes.data.users;

        const users = Object.keys(usersData).map((userId) => ({
            userId: Number(userId),
            username: usersData[userId],
        }));

        const userPostCounts = await Promise.all(
            users.map(async (user) => {
                try {
                    const postsRes = await apiClient.get(
                        `/users/${user.userId}/posts`
                    );
                    return { ...user, postCount: postsRes.data.posts.length };
                } catch (error) {
                    console.error(
                        `Error fetching posts for user ${user.userId}:`,
                        error.message
                    );
                    return { ...user, postCount: 0 };
                }
            })
        );

        const topUsers = userPostCounts
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, 5);
        res.json(topUsers);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/posts", async (req, res) => {
    try {
        const { type } = req.query;
        const apiClient = await getApiClient();

        const usersRes = await apiClient.get("/users");
        const usersData = usersRes.data.users;
        const userIds = Object.keys(usersData);

        const allPosts = (
            await Promise.all(
                userIds.map(async (userId) => {
                    try {
                        const postsRes = await apiClient.get(
                            `/users/${userId}/posts`
                        );
                        return postsRes.data.posts.map((post) => ({
                            ...post,
                            username: usersData[userId],
                        }));
                    } catch (error) {
                        console.error(
                            `Error fetching posts for user ${userId}:`,
                            error.message
                        );
                        return [];
                    }
                })
            )
        ).flat();

        if (type === "latest") {
            const latestPosts = allPosts
                .sort((a, b) => b.id - a.id)
                .slice(0, 5);
            return res.json({ type: "latest", latestPosts });
        } else if (type === "popular") {
            try {
                const commentCounts = Object.fromEntries(
                    await Promise.all(
                        allPosts.map(async (post) => {
                            try {
                                const commentsRes = await apiClient.get(
                                    `/posts/${post.id}/comments`
                                );
                                return [
                                    post.id,
                                    commentsRes.data.comments.length,
                                ];
                            } catch (error) {
                                console.error(
                                    `Error fetching comments for post ${post.id}:`,
                                    error.message
                                );
                                return [post.id, 0];
                            }
                        })
                    )
                );

                const sortedPosts = allPosts
                    .map((post) => ({
                        postId: post.id,
                        userid: post.userid,
                        commentCount: commentCounts[post.id] || 0,
                    }))
                    .sort((a, b) => b.commentCount - a.commentCount)
                    .slice(0, 5);

                return res.json({ type: "popular", topPosts: sortedPosts });
            } catch (error) {
                console.error("Error fetching popular posts:", error.message);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }

        res.status(400).json({
            error: "Invalid type parameter. Use 'latest' or 'popular'.",
        });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, async () => {
    await fetchBearerToken();
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
