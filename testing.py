import os

def print_structure(path, indent=0):
    # Get a list of all files and folders in the given directory
    try:
        for item in os.listdir(path):
            # Get full path
            full_path = os.path.join(path, item)
            
            # Print the item with indentation based on its depth in the directory
            print(' ' * indent + item)
            
            # If it's a directory, recursively print its contents
            if os.path.isdir(full_path):
                print_structure(full_path, indent + 4)  # Increase indentation for subdirectories
    except PermissionError:
        print(' ' * indent + '[Permission Denied]')
    except FileNotFoundError:
        print(' ' * indent + '[Directory Not Found]')

# Replace 'your_directory_path' with the path of the directory you want to scan
directory_path = '.'  # Change this to the path you want to scan
print_structure(directory_path)
