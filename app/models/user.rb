class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }
  
  validates :password, confirmation: true
  validates :password, length: { minimum: 8, maximum: 30 }
  
  enum :user_role, { student: 0, teacher: 1 }
end
