import { useRouter } from "next/router";

const Student = () => {
  const router = useRouter();
  const { pid } = router.query;

  return <p>Student Page: {pid}</p>;
};

export default Student;
