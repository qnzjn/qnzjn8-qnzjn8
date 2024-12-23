'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './board.module.css'

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
  images?: string[]
}

export default function BoardPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    setPosts(savedPosts.sort((a: Post, b: Post) => b.id - a.id))
  }, [])

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(posts.length / postsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  const renderPagination = () => {
    const pageNumbers = []
    const maxPageButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={styles.pageButton}
          >
            이전
          </button>
        )}

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={styles.pageButton}
            >
              1
            </button>
            {startPage > 2 && <span className={styles.ellipsis}>...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`${styles.pageButton} ${
              currentPage === number ? styles.active : ''
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={styles.pageButton}
            >
              {totalPages}
            </button>
          </>
        )}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={styles.pageButton}
          >
            다음
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>자유게시판</h1>
      
      <div className={styles.boardHeader}>
        <button
          onClick={() => router.push('/board/write')}
          className={styles.writeButton}
        >
          글쓰기
        </button>
      </div>

      <div className={styles.boardList}>
        <div className={styles.header}>
          <span className={styles.number}>번호</span>
          <span className={styles.title}>제목</span>
          <span className={styles.author}>작성자</span>
          <span className={styles.date}>작성일</span>
          <span className={styles.views}>조회수</span>
        </div>

        {currentPosts.map((post, index) => (
          <div
            key={post.id}
            className={styles.row}
            onClick={() => router.push(`/board/${post.id}`)}
          >
            <span className={styles.number}>
              {posts.length - (indexOfFirstPost + index)}
            </span>
            <span className={styles.title}>
              {post.title}
              {post.images && post.images.length > 0 && (
                <span className={styles.imageIcon}>📷</span>
              )}
            </span>
            <span className={styles.author}>{post.author}</span>
            <span className={styles.date}>{post.date}</span>
            <span className={styles.views}>{post.views}</span>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  )
} 