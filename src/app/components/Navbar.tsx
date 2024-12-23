'use client'

import Link from 'next/link'
import styles from './Navbar.module.css'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          OneBite
        </Link>

        {/* 모바일 메뉴 토글 버튼 */}
        <button 
          className={styles.menuButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.menuIcon}></span>
        </button>

        {/* 네비게이션 링크 */}
        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <Link href="/" className={styles.navLink}>홈</Link>
          <Link href="/board" className={styles.navLink}>자유게시판</Link>
        </div>
      </div>
    </nav>
  )
} 