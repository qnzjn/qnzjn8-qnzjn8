'use client'

import styles from '../page.module.css'

export default function Button() {
  const handleClick = () => {
    alert('버튼이 클릭되었습니다!')
  }

  return (
    <button className={styles.button} onClick={handleClick}>
      클릭하세요!
    </button>
  )
} 