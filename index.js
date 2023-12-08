const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path");
const app = express();
const DataStorageFile = "blogdata.json";
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// Function to read employee data from JSON file
function readBlogData() {
  try {
    const data = fs.readFileSync(DataStorageFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Function to write employee data to JSON file
function writeBlogData(blogData) {
  const data = JSON.stringify(blogData, null, 2);
  fs.writeFileSync(DataStorageFile, data);
}

// Get all employees
app.get("/blog", (req, res) => {
  const blogData = readBlogData();
  res.json(blogData);
});

// Get an employee by ID
app.get("/blog/:id", (req, res) => {
  const blogs = readBlogData();
  const blog = blogs.find((item) => item.id === req.params.id);

  if (!blog) {
    res.status(404).json({ error: "blog not found" });
  } else {
    res.json(blog);
  }
});

// Create an blog
app.post("/blog", (req, res) => {
    try {
      let blogData = readBlogData();
  
      // Ensure that blogData is an array
      if (!Array.isArray(blogData)) {
        blogData = [];
      }
  
      const newBlog = req.body;
      const validationErrors = validateBlogData(newBlog);
  
      if (validationErrors.length > 0) {
        res.status(400).json({ errors: validationErrors });
      } else {
        newBlog.id = uuidv4();
        
        // Push the new blog to the array
        blogData.push(newBlog);
  
        // Write the updated array back to the file
        writeBlogData(blogData);
  
        res
          .status(201)
          .json({ message: "blog created successfully",blogData});
      }
    } catch (error) {
      console.error("Error in POST /blog:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
// Update an employee
app.put("/blog/:id", (req, res) => {
  const blog = readBlogData();
  const blogIndex = blog.findIndex((item) => item.id === req.params.id);

  if (blogIndex === -1) {
    res.status(404).json({ error: "blog not found" });
  } else {
    const updatedBlog = req.body;
    const validationErrors = validateBlogData(updatedBlog);
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
    } else {
      blog[blogIndex] = {
        ...blog[blogIndex],
        ...updatedBlog,
      };
      writeBlogData(blog);
      res.json({ message: "blog updated successfully" });
    }
  }
});

// Delete an employee
app.delete("/blog/:id", (req, res) => {
  const blog = readBlogData();
  const blogIndex = blog.findIndex((item) => item.id === req.params.id);

  if (blogIndex === -1) {
    res.status(404).json({ error: "blog not found" });
  } else {
    blog.splice(blogIndex, 1);
    writeBlogData(blog);
    res.json({ message: "blog deleted successfully" });
  }
});

// Validate employee data
function validateBlogData(blog) {
    const errors = [];
  
    if (!blog.BlogTitle) {
      errors.push("title is required");
    }
    if (!blog.BlogDiscription) {
      errors.push("Discription is required");
    }
    if (!blog.BlogContent) {
      errors.push("Content is required");
    }
    if (!blog.imageURL) {
      errors.push("Content is required");
    }
   
  
    return errors;
  }

// Start the server
app.listen(4000, () => {
  console.log("API server is running on port 4000");
});
