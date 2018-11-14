for file in ./**/*.jsx.tsx
do
 mv "$file" "${file%.jsx.tsx}.tsx"
done