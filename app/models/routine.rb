class Routine < ApplicationRecord
    has_many :days, dependent: :destroy
    accepts_nested_attributes_for :days, allow_destroy: true
end
