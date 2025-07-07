"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Search, User } from "lucide-react"
import { BlogPost, blogPosts } from "@/lib/blog-data"

export default function BlogOverview() {
  const [searchQuery, setSearchQuery] = useState("")
  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))

  const filteredPosts = (category: string) => {
    return blogPosts.filter(
      (post) =>
        (category === "All" || post.category === category) &&
        (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of articles on design, development, and creative inspiration
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" className="mb-12">
          <TabsList className="mx-auto flex flex-wrap justify-center">
            <TabsTrigger value="All">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Posts Tab */}
          <TabsContent value="All" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts("All").map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            {filteredPosts("All").length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found matching your search.</p>
              </div>
            )}
          </TabsContent>

          {/* Category Tabs */}
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts(category).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              {filteredPosts(category).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts found matching your search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Featured Post */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-8">Featured Post</h2>
          <FeaturedBlogCard post={blogPosts[0]} />
        </div>
      </div>
    </div>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group rounded-xl overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.heroImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <Badge variant="secondary" className="mb-3">
            {post.category}
          </Badge>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-3 h-3 mr-1" />
            <span className="mr-4">{post.author}</span>
            <Clock className="w-3 h-3 mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group rounded-xl overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative h-64 md:h-full w-full overflow-hidden">
          <Image
            src={post.heroImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-muted-foreground mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <Link href={`/blog/${post.slug}`}>
            <Button>Read Article</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
