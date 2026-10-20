Feature: Purchase Validation Rules
  As a system quality engineer
  I want all business rules validated during bundle purchases
  So that invalid requests are rejected with clear user messages

  Background:
    Given a fresh account exists with a balance of "300.00"
    And I am on the Buy Data page for my account

  Scenario Outline: Business rules validation for bundle purchases
    When I enter the mobile number "<mobileNumber>"
    And I select the bundle "<bundle>"
    And I click "Buy data"
    Then the page displays the message "<expectedMessage>"

    @smoke
    Examples: Accepted Purchases
      | mobileNumber | bundle | expectedMessage             |
      | 0611234567   | 500MB  | 500MB data bundle purchased |
      | 0839876543   | 2GB    | 2GB data bundle purchased   |

    @negative
    Examples: Rejected Purchases
      | mobileNumber | bundle | expectedMessage                       |
      | 0121234567   | 1GB    | Enter a valid SA mobile number        |
      | 08212345     | 500MB  | Enter a valid SA mobile number        |
      | +27821234567 | 1GB    | Enter a valid SA mobile number        |
      | 082 123 4567 | 1GB    | Enter a valid SA mobile number        |
      | 0821234567   | None   | Choose a data bundle                  |
      | 0821234567   | 10GB   | Not enough funds in your Flash wallet |