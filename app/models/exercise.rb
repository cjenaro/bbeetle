class Exercise < ApplicationRecord
  has_one_attached :media
  validates :name, presence: true
  validates :description, presence: true
end
