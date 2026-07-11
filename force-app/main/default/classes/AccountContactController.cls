/**
 * Controller class to handle Account and Contact data operations
 */
public with sharing class AccountContactController {
    
    /**
     * Retrieves accounts with their related contacts
     * @return List of accounts with related contacts
     */
    @AuraEnabled
    public static List<AccountWrapper> getAccountsAndContacts() {
        List<AccountWrapper> accountWrappers = new List<AccountWrapper>();
        
        // Query accounts with related contacts
        List<Account> accounts = [
            SELECT Id, Name, Industry, Type, Phone,
                   (SELECT Id, Name, Email, Phone FROM Contacts)
            FROM Account
            ORDER BY Name
        ];
        
        // Wrap accounts and their contacts
        for (Account acc : accounts) {
            AccountWrapper wrapper = new AccountWrapper();
            wrapper.id = acc.Id;
            wrapper.Name = acc.Name;
            wrapper.Industry = acc.Industry;
            wrapper.Type = acc.Type;
            wrapper.Phone = acc.Phone;
            wrapper.contacts = new List<ContactWrapper>();
            
            // Add contacts if they exist
            if (acc.Contacts != null && !acc.Contacts.isEmpty()) {
                for (Contact contact : acc.Contacts) {
                    ContactWrapper contactWrapper = new ContactWrapper();
                    contactWrapper.Id = contact.Id;
                    contactWrapper.Name = contact.Name;
                    contactWrapper.Email = contact.Email;
                    contactWrapper.Phone = contact.Phone;
                    wrapper.contacts.add(contactWrapper);
                }
            }
            
            accountWrappers.add(wrapper);
        }
        
        return accountWrappers;
    }
    
    /**
     * Updates an account record
     * @param account The account to update
     * @return The updated account
     */
    @AuraEnabled
    public static Account updateAccount(Account account) {
        try {
            // Perform the update
            update account;
            return account;
        } catch (Exception e) {
            // Re-throw the exception to be handled by the client
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    /**
     * Wrapper class for Account data
     */
    public class AccountWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String Name;
        @AuraEnabled public String Industry;
        @AuraEnabled public String Type;
        @AuraEnabled public String Phone;
        @AuraEnabled public List<ContactWrapper> contacts;
        
        public AccountWrapper() {
            contacts = new List<ContactWrapper>();
        }
    }
    
    /**
     * Wrapper class for Contact data
     */
    public class ContactWrapper {
        @AuraEnabled public String Id;
        @AuraEnabled public String Name;
        @AuraEnabled public String Email;
        @AuraEnabled public String Phone;
    }
}
