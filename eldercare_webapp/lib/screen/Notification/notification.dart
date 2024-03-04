import 'package:flutter/material.dart';
import 'package:stacked_notification_cards/stacked_notification_cards.dart';

class Notifications {
  final String message;
  final String date;
  final String time;

  Notifications({required this.message, required this.date, required this.time});
}

class NotificationCard extends StatelessWidget {
  final Notifications notifications;
  

  const NotificationCard({Key? key, required this.notifications})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(notifications.message),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(notifications.date),
            Text(notifications.time),
          ],
        ),
      ),
    );
  }
}
/*
class NotificationScreen extends StatelessWidget {
  final List<Notification> notifications;

  const NotificationScreen({Key? key, required this.notifications})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
      ),
      body: ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          return NotificationCard(notifications: notifications[index]);
        },
      ),
    );
  }
}*/