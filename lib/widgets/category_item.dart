import 'package:flutter/material.dart';

class CategoryItem extends StatelessWidget {
  final String categoryName;
  final bool isSelected;
  final VoidCallback onTap;

  const CategoryItem({
    super.key,
    required this.categoryName,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected
                  ? Colors.deepOrange
                  : (isDark ? Colors.grey[850] : const Color(0xFFF7F2EB)),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected
                    ? Colors.deepOrange
                    : (isDark ? Colors.grey[750]! : const Color(0xFFE8DFD5)),
                width: 1,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: Colors.deepOrange.withOpacity(0.3),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      )
                    ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _getCategoryIcon(categoryName, isSelected),
                const SizedBox(width: 6),
                Text(
                  categoryName,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: isSelected
                        ? Colors.white
                        : (isDark ? Colors.grey[300] : const Color(0xFF4A4036)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _getCategoryIcon(String category, bool selected) {
    IconData icon;
    switch (category.toLowerCase()) {
      case 'breakfast':
        icon = Icons.egg_alt_outlined;
        break;
      case 'lunch':
        icon = Icons.lunch_dining_outlined;
        break;
      case 'dinner':
        icon = Icons.dinner_dining_outlined;
        break;
      case 'dessert':
        icon = Icons.cake_outlined;
        break;
      case 'chicken':
        icon = Icons.restaurant;
        break;
      case 'beef':
        icon = Icons.kebab_dining;
        break;
      case 'vegetarian':
        icon = Icons.eco_outlined;
        break;
      case 'seafood':
        icon = Icons.set_meal_outlined;
        break;
      default:
        icon = Icons.local_fire_department_outlined;
    }

    return Icon(
      icon,
      size: 16,
      color: selected ? Colors.white : Colors.deepOrange,
    );
  }
}
