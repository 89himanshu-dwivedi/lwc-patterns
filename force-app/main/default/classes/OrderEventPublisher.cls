/**
 * Publishes Order_Status_Event__e platform events.
 *
 * WHY platform events for integration:
 *  - Fire-and-forget decoupling: publisher never waits for subscribers.
 *  - PublishAfterCommit -> event only goes out if the transaction commits,
 *    so downstream systems never see phantom data from rolled-back DML.
 */
public with sharing class OrderEventPublisher {

    /** Convenience one-liner used by services/triggers. */
    public static void publishStatus(String orderNumber, String status) {
        publish(new List<Order_Status_Event__e>{
            new Order_Status_Event__e(Order_Number__c = orderNumber, Status__c = status)
        });
    }

    /** Bulk publish with per-event failure logging (publish is NOT all-or-none). */
    public static List<Database.SaveResult> publish(List<Order_Status_Event__e> events) {
        List<Database.SaveResult> results = EventBus.publish(events);
        for (Integer i = 0; i < results.size(); i++) {
            if (!results[i].isSuccess()) {
                for (Database.Error err : results[i].getErrors()) {
                    System.debug(LoggingLevel.ERROR,
                        'Event publish failed [' + events[i].Order_Number__c + ']: ' + err.getMessage());
                }
            }
        }
        return results;
    }
}
