class Exercise < ApplicationRecord
  has_one_attached :media
  has_many :week_exercises, dependent: :destroy
  
  validates :name, presence: true
  validates :description, presence: true

  def remove_media!
    media.purge if media.attached?
  end
end
