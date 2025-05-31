class BlockExercise < ApplicationRecord
  belongs_to :block
  belongs_to :exercise
  
  validates :weeks_count, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 12 }
  validate :validate_weekly_reps
  
  def reps_for_week(week)
    return weekly_reps[week - 1] if weekly_reps.is_a?(Array) && weekly_reps[week - 1]
    
    # Final fallback
    10
  end
  
  def setup_default_weekly_reps!
    self.weekly_reps = Array.new(weeks_count, 10)
    save if persisted?
  end
  
  private
  
  def validate_weekly_reps
    return unless weeks_count.present?
    
    if weekly_reps.length != weeks_count
      errors.add(:weekly_reps, "Must have exactly #{weeks_count} weeks")
    end
    
    weekly_reps.each_with_index do |reps_value, index|
      week_num = index + 1
      if reps_value.blank?
        errors.add(:weekly_reps, "Week #{week_num} reps is required")
      else
        begin
          converted_value = case reps_value
          when Integer
            reps_value
          when String, Numeric
            Integer(reps_value)
          else
            raise ArgumentError, "Cannot convert #{reps_value.class}"
          end
          
          if converted_value <= 0
            errors.add(:weekly_reps, "Week #{week_num} reps must be a positive number. Got: #{converted_value}")
          else
            weekly_reps[index] = converted_value
          end
        rescue ArgumentError, TypeError
          errors.add(:weekly_reps, "Week #{week_num} reps must be a valid number. Got: #{reps_value.inspect} (#{reps_value.class})")
        end
      end
    end
  end
end
