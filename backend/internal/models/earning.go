package models

import "time"

type Earning struct {
	BaseModel
	AuthorID   uint    `gorm:"not null;index" json:"author_id"`
	Author     *Author `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	OrderID    uint    `gorm:"not null;index" json:"order_id"`
	Order      *Order  `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	BookID     uint    `gorm:"not null;index" json:"book_id"`
	Book       *Book   `gorm:"foreignKey:BookID" json:"book,omitempty"`
	Amount     float64 `gorm:"not null" json:"amount"` // Author's share
	Commission float64 `gorm:"not null" json:"commission"` // Platform fee
	Status     string  `gorm:"default:pending;index" json:"status"` // pending, available, paid
	PayoutID   *uint   `gorm:"index" json:"payout_id,omitempty"`
}

type Payout struct {
	BaseModel
	AuthorID       uint       `gorm:"not null;index" json:"author_id"`
	Author         *Author    `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	Amount         float64    `gorm:"not null" json:"amount"`
	Status         string     `gorm:"default:requested;index" json:"status"` // requested, processing, completed, failed
	Method         string     `json:"method"` // bank_transfer, paypal, etc.
	AccountDetails string     `gorm:"type:text" json:"-"` // Encrypted, not exposed in JSON
	RequestedAt    time.Time  `gorm:"not null" json:"requested_at"`
	ProcessedAt    *time.Time `json:"processed_at,omitempty"`
	Notes          string     `gorm:"type:text" json:"notes"`
}
