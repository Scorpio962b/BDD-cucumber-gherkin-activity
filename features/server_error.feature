Feature: Server Error Handling
  As a customer
  I want a friendly error message when the network drops or server fails
  So that I know my purchase could not be completed

  Background:
    Given a fresh account exists with a balance of "300.00"
    And I am on the Buy Data page for my account

  @negative
  Scenario: Handling server 500 failure during purchase
    Given the purchase API service is returning a 500 error
    When I enter the mobile number "0821234567"
    And I select the bundle "500MB"
    And I click "Buy data"
    Then the page displays the message "We couldn't complete your purchase. Please try again."
