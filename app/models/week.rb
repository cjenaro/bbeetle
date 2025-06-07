class Week < ApplicationRecord
  belongs_to :block
  has_many :week_exercises, dependent: :destroy
  
  validates :week_number, presence: true, numericality: { greater_than: 0 }
  validates :week_number, uniqueness: { scope: :block_id }
  
  accepts_nested_attributes_for :week_exercises, allow_destroy: true, reject_if: :all_blank
end 