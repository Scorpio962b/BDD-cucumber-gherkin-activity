Feature: Buy Data Bundle Core Scenarios
  As a digital wallet customer
  I want to buy data bundles using my mobile number
  So that I can stay connected with internet data

  Background:
    Given a fresh account exists with a balance of "300.00"
    And I am on the Buy Data page for my account

  @smoke
  Scenario: Successful data bundle purchase verified on page and API
    When I enter the mobile number "0821234567"
    And I select the bundle "1GB"
    And I click "Buy data"
    Then the page displays the message "1GB data bundle purchased"
    And a valid purchase reference is displayed
    And the updated balance displays "201.00"
    And the purchase is recorded in the account history via API

  Scenario: Purchasing multiple bundles in a single visit using a data table
    When I purchase the following bundles sequentially:
      | mobileNumber | bundle |
      | 0729876543   | 500MB  |
      | 0835551234   | 1GB    |
    Then the final balance displays "146.00"
    And 2 purchases are confirmed in the API purchase history

  @negative
  Scenario: Exceeding the daily limit of 3 data bundle purchases
    Given 3 data bundles have already been purchased via the API for this account
    When I enter the mobile number "0821234567"
    And I select the bundle "500MB"
    And I click "Buy data"
    Then the page displays the message "You can buy up to 3 data bundles a day" 