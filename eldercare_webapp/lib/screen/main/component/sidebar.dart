import 'package:eldercare_webapp/constants.dart';
import 'package:eldercare_webapp/screen/Notification/notification.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SideMenu extends StatelessWidget {
  const SideMenu({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: secondaryColor,
      child: ListView(
        children: [
          DrawerHeader(
            child: Image.asset(
              "assets/images/logo.png",
              color: primaryColor,
            ),
          ),
          DrawerListTile(
            title: "Dashboard",
            svgSrc: "assets/icons/dashboard.svg",
            press: () {},
          ),
          DrawerListTile(
            title: "Patients",
            svgSrc: "assets/icons/person.svg",
            press: () {},
          ),
          DrawerListTile(
            title: "Notification",
            svgSrc: "assets/icons/alert.svg",
            press: () {
             /* Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => NotificationScreen(
          notifications: [
            Notifications(
              message: 'Message notification description',
              date: '23-01-2021',
              time: '07:10 am',
            ),
            // Add more notifications here
          ],
        ),),
              );*/
            },
          ),
          DrawerListTile(
            title: "Customization",
            svgSrc: "assets/icons/customize.svg",
            press: () {},
          ),
          DrawerListTile(
            title: "Setting",
            svgSrc: "assets/icons/setting.svg",
            press: () {},
          ),
          DrawerListTile(
            title: "Signout",
            svgSrc: "assets/icons/signout.svg",
            press: () {},
          ),
        ],
      ),
    );
  }
}

class DrawerListTile extends StatelessWidget {
  const DrawerListTile({
    Key? key,
    // For selecting those three line once press "Command+D"
    required this.title,
    required this.svgSrc,
    required this.press,
  }) : super(key: key);

  final String title, svgSrc;
  final VoidCallback press;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: press,
      horizontalTitleGap: 12.0,
      leading: SvgPicture.asset(
        svgSrc,
        colorFilter: ColorFilter.mode(primaryColor, BlendMode.srcIn),
        height: 20,
      ),
      title: Text(
        title,
        style: TextStyle(color: primaryColor),
      ),
    );
  }
}
class Notification {
  final String message;
  final String date;
  final String time;

  Notification({required this.message, required this.date, required this.time});
}